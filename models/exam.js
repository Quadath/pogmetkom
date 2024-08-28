const mongoose = require('mongoose')

const ExamSchema = new mongoose.Schema({
    job: {
        type: String,
        required: true
    },
    result: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Exam', ExamSchema)