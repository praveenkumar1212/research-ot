const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedMentor = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Check if mentor already exists
        const mentorExists = await User.findOne({ email: 'mentor@rot.com' });
        if (mentorExists) {
            console.log('Mentor user already exists (mentor@rot.com). You can login with it.');
            process.exit(0);
        }

        // Create new Mentor user
        const mentorUser = new User({
            name: 'System Mentor',
            email: 'mentor@rot.com',
            password: 'mentor123', // Will be hashed by pre-save hook
            role: 'Mentor'
        });

        await mentorUser.save();
        console.log('Mentor user seeded successfully!');
        console.log('Email: mentor@rot.com');
        console.log('Password: mentor123');
        
        process.exit(0);
    } catch (err) {
        console.error('Error seeding mentor user:', err);
        process.exit(1);
    }
};

seedMentor();
