const mongoose = require('mongoose');

const ResearchSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Pending', 'Ongoing', 'Completed', 'Published'],
        default: 'Pending'
    },
    progress: { type: [String], default: [] },
    publishedDate: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Research', ResearchSchema);
