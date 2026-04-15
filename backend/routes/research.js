const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Research = require('../models/Research');
const User = require('../models/User');

// @route   GET api/research
// @desc    Get all research (or user specific if query param provided)
router.get('/', auth, async (req, res) => {
    try {
        let where = {};
        if (req.query.user === 'me') {
            where.userId = req.user.id;
        }
        if (req.query.status) {
            where.status = req.query.status;
        }
        const research = await Research.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json(research);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   GET api/research/all
// @desc    Get all research across all users (Admin & Mentor only)
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'Admin' && req.user.role !== 'Mentor') {
            return res.status(403).json({ msg: 'Access denied. Admins and Mentors only.' });
        }
        
        let where = {};
        if (req.query.status) {
            where.status = req.query.status;
        }
        
        const research = await Research.findAll({
            where,
            include: [{
                model: User,
                attributes: ['name', 'email', 'role']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        // Transform to match the old Mongoose .populate() format
        const transformed = research.map(r => {
            const plain = r.toJSON();
            plain.userId = plain.User || plain.userId;
            delete plain.User;
            return plain;
        });
            
        res.json(transformed);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   POST api/research
// @desc    Add new research
router.post('/', auth, async (req, res) => {
    const { title, description, startDate, status } = req.body;
    try {
        const research = await Research.create({
            title, description, startDate, status, userId: req.user.id
        });
        res.json(research);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   PUT api/research/:id/publish
// @desc    Publish research
router.put('/:id/publish', auth, async (req, res) => {
    try {
        let research = await Research.findByPk(req.params.id);
        if (!research) return res.status(404).json({ msg: 'Research not found' });
        if (research.userId !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        if (!research.mentorApproved) {
            return res.status(400).json({ msg: 'Cannot publish before Mentor verification.' });
        }

        research.status = 'Published';
        research.publishedDate = new Date();
        await research.save();
        res.json(research);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   PUT api/research/:id/approve
// @desc    Approve research (Mentor only)
router.put('/:id/approve', auth, async (req, res) => {
    try {
        if (req.user.role !== 'Mentor') {
            return res.status(403).json({ msg: 'Access denied. Mentors only.' });
        }

        let research = await Research.findByPk(req.params.id);
        if (!research) return res.status(404).json({ msg: 'Research not found' });

        research.mentorApproved = true;
        await research.save();
        res.json(research);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   PATCH api/research/:id/progress
// @desc    Update progress array for a research project
router.patch('/:id/progress', auth, async (req, res) => {
    try {
        const { progress, proofFileName, proofData } = req.body;
        let research = await Research.findByPk(req.params.id);
        if (!research) return res.status(404).json({ msg: 'Research not found' });
        if (research.userId !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        research.progress = progress;
        if (proofFileName) research.proofFileName = proofFileName;
        if (proofData) research.proofData = proofData;
        // Auto-complete if 7 steps are checked
        if (progress && progress.length === 7) {
            research.status = 'Completed';
        }
        
        await research.save();
        res.json(research);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   DELETE api/research/:id
// @desc    Delete research
router.delete('/:id', auth, async (req, res) => {
    console.log(`DELETE request for ID: ${req.params.id} from user: ${req.user.id}`);
    try {
        const research = await Research.findByPk(req.params.id);
        console.log('Found research:', research ? 'YES' : 'NO');

        if (!research) return res.status(404).json({ msg: 'Research not found' });

        console.log(`Research UserID: ${research.userId}, Request UserID: ${req.user.id}, Role: ${req.user.role}`);
        
        const isOwner = research.userId === req.user.id;
        const isAdminOrMentor = req.user.role === 'Admin' || req.user.role === 'Mentor';

        if (!isOwner && !isAdminOrMentor) {
            console.log('User not authorized to delete this research');
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await research.destroy();
        console.log('Research deleted successfully');
        res.json({ msg: 'Research removed' });
    } catch (err) {
        console.error('Delete Research Error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
