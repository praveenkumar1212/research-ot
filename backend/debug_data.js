const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Research = require('./models/Research');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const research = await Research.find({});
        console.log(`Found ${research.length} research projects:`);
        research.forEach(r => {
            console.log(`ID: ${r._id}, Title: ${r.title}, UserID: ${r.userId}`);
        });
        process.exit();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
