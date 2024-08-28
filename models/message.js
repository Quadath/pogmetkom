const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    text: String,
    times: Number
})

module.exports = mongoose.model('message', MessageSchema)