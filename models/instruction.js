const mongoose = require('mongoose')

const InstructionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    questions: [
        {
            text: {
                type: String,
                required: true
            },
            answers: [
                {
                    text: {
                        type: String,
                        required: true
                    },
                    required: Boolean,
                    _id: false
                }
            ],
            _id: false
        }
    ]
})

module.exports = mongoose.model('instructions', InstructionSchema)