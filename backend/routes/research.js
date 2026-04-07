const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Research = require('../models/Research');

// @route   GET api/research
// @desc    Get all research (or user specific if query param provided)
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.query.user === 'me') {
            query.userId = req.user.id;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }
        const research = await Research.find(query).sort({ createdAt: -1 });
        res.json(research);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   POST api/research
// @desc    Add new research
router.post('/', auth, async (req, res) => {
    const { title, description, startDate, status } = req.body;
    try {
        const newResearch = new Research({
            title, description, startDate, status, userId: req.user.id
        });
        const research = await newResearch.save();
        res.json(research);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   PUT api/research/:id/publish
// @desc    Publish research
router.put('/:id/publish', auth, async (req, res) => {
    try {
        let research = await Research.findById(req.params.id);
        if (!research) return res.status(404).json({ msg: 'Research not found' });
        if (research.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        research.status = 'Published';
        research.publishedDate = Date.now();
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
        const { progress } = req.body;
        let research = await Research.findById(req.params.id);
        if (!research) return res.status(404).json({ msg: 'Research not found' });
        if (research.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        research.progress = progress;
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.log('Invalid research ID format:', req.params.id);
            return res.status(400).json({ msg: 'Invalid ID format' });
        }

        const research = await Research.findById(req.params.id);
        console.log('Found research:', research ? 'YES' : 'NO');

        if (!research) return res.status(404).json({ msg: 'Research not found' });

        console.log(`Research UserID: ${research.userId}, Request UserID: ${req.user.id}`);
        if (research.userId.toString() !== req.user.id) {
            console.log('User not authorized to delete this research');
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await research.deleteOne();
        console.log('Research deleted successfully');
        res.json({ msg: 'Research removed' });
    } catch (err) {
        console.error('Delete Research Error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
