const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);

        const email = 'praveenkumar.ec23@bitsathy.ac.in';
        await User.deleteMany({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        console.log('Cleared existing records for: ' + email);

        const user = new User({
            name: 'Praveen Kumar',
            email: email,
            password: 'password123',
            role: 'User'
        });

        console.log('Saving user with password: password123');
        await user.save();

        const savedUser = await User.findOne({ email });
        console.log('Account verified in DB!');
        console.log('Hashed Password stored: ' + savedUser.password);

        process.exit(0);
    } catch (err) {
        console.error('SEEDING FAILED:', err.message);
        process.exit(1);
    }
}

seed();
