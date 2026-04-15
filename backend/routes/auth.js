const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register user
router.post('/register', async (req, res) => {
    let { name, email, password, role } = req.body;
    console.log('Registration Request Body:', req.body);
    email = email.toLowerCase().trim();
    console.log(`Registration attempt for: ${email}`);
    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            console.log(`User already exists: ${email}`);
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = await User.create({ name, email, password, role });
        console.log(`User registered successfully: ${email}`);

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Registration Error Details:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase().trim();
    console.log(`Login attempt for: ${email}`);
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`User not found: ${email}`);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`Password mismatch for: ${email}`);
            console.log(`- Received password length: ${password.length}`);
            console.log(`- Stored hash starts with: ${user.password.substring(0, 10)}...`);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        console.log(`Login successful: ${email}`);
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Login Error Details:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
