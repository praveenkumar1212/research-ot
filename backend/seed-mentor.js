const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./db');
const User = require('./models/User');

const seedMentor = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('PostgreSQL Connected...');

        // Check if mentor already exists
        const mentorExists = await User.findOne({ where: { email: 'mentor@rot.com' } });
        if (mentorExists) {
            console.log('Mentor user already exists (mentor@rot.com). You can login with it.');
            process.exit(0);
        }

        // Create new Mentor user
        await User.create({
            name: 'System Mentor',
            email: 'mentor@rot.com',
            password: 'mentor123', // Will be hashed by beforeCreate hook
            role: 'Mentor'
        });

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
