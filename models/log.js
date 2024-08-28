const mongoose = require('mongoose')
const logSchema = new mongoose.Schema({}, {strict: false, collection: 'log'})

module.exports = mongoose.model('Logger', logSchema)