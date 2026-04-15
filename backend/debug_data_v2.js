const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./db');
const Research = require('./models/Research');

async function run() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('--- DB INSPECTION START ---');
        const research = await Research.findAll();
        research.forEach(r => {
            console.log(`RES_ID:[${r.id}] USER_ID:[${r.userId || 'NULL'}] TITLE:[${r.title}]`);
        });
        console.log('--- DB INSPECTION END ---');
        process.exit(0);
    } catch (err) {
        console.error('INSPECTION ERROR:', err);
        process.exit(1);
    }
}

run();
