const express = require('express')
const router = express.Router()
const InstructionSchema = require('../models/instruction.js')

router.post('/', async (req, res) => {
    console.log(req.body)
    const {name, number, questions} = req.body
    await InstructionSchema.create({
        name, number, questions
    })
    res.json({'hi': 'hi'})
    res.send()
})

module.exports = router