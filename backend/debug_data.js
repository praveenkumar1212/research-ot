const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./db');
const Research = require('./models/Research');

sequelize.authenticate()
    .then(() => sequelize.sync())
    .then(async () => {
        console.log('Connected to PostgreSQL');
        const research = await Research.findAll();
        console.log(`Found ${research.length} research projects:`);
        research.forEach(r => {
            console.log(`ID: ${r.id}, Title: ${r.title}, UserID: ${r.userId}`);
        });
        process.exit();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
