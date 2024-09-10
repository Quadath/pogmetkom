const mongoose = require('mongoose')
const ErrorSchema = new mongoose.Schema({}, {strict: false, collection: 'errors'})

module.exports = mongoose.model('Error', ErrorSchema)