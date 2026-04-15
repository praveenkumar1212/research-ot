const dotenv = require('dotenv');
dotenv.config();

const { Op } = require('sequelize');
const sequelize = require('./db');
const User = require('./models/User');

async function seed() {
    try {
        console.log('Connecting to PostgreSQL...');
        await sequelize.authenticate();
        await sequelize.sync();

        const email = 'praveenkumar.ec23@bitsathy.ac.in';
        await User.destroy({ where: { email: { [Op.iLike]: email } } });
        console.log('Cleared existing records for: ' + email);

        const user = await User.create({
            name: 'Praveen Kumar',
            email: email,
            password: 'password123',
            role: 'User'
        });

        console.log('Saving user with password: password123');

        const savedUser = await User.findOne({ where: { email } });
        console.log('Account verified in DB!');
        console.log('Hashed Password stored: ' + savedUser.password);

        process.exit(0);
    } catch (err) {
        console.error('SEEDING FAILED:', err.message);
        process.exit(1);
    }
}

seed();
