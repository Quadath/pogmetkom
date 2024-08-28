const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    job: String,
    exams: [{type: mongoose.Types.ObjectId, ref: 'Exam'}],
    telegramId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema)