const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Research = require('./models/Research');

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- DB INSPECTION START ---');
        const research = await Research.find({});
        research.forEach(r => {
            console.log(`RES_ID:[${r._id.toString()}] USER_ID:[${r.userId ? r.userId.toString() : 'NULL'}] TITLE:[${r.title}]`);
        });
        console.log('--- DB INSPECTION END ---');
        process.exit(0);
    } catch (err) {
        console.error('INSPECTION ERROR:', err);
        process.exit(1);
    }
}

run();
