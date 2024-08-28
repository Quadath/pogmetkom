const mongoose = require('mongoose')

const ExamSchema = new mongoose.Schema({
    job: {
        type: String,
        required: true
    },
    result: {
        type: Number,
        required: true
    },
    time: Number
})

module.exports = mongoose.model('Exam', ExamSchema)