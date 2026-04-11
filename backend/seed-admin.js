const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@rot.com' });
        if (adminExists) {
            console.log('Admin user already exists (admin@rot.com). You can login with it.');
            process.exit(0);
        }

        // Create new Admin user
        const adminUser = new User({
            name: 'System Admin',
            email: 'admin@rot.com',
            password: 'admin', // Will be hashed by pre-save hook
            role: 'Admin'
        });

        await adminUser.save();
        console.log('Admin user seeded successfully!');
        console.log('Email: admin@rot.com');
        console.log('Password: admin');
        
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin user:', err);
        process.exit(1);
    }
};

seedAdmin();
