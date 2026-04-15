const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./db');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('PostgreSQL Connected...');

        // Check if admin already exists
        const adminExists = await User.findOne({ where: { email: 'admin@rot.com' } });
        if (adminExists) {
            console.log('Admin user already exists (admin@rot.com). You can login with it.');
            process.exit(0);
        }

        // Create new Admin user
        await User.create({
            name: 'System Admin',
            email: 'admin@rot.com',
            password: 'admin', // Will be hashed by beforeCreate hook
            role: 'Admin'
        });

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
