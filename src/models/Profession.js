const mongoose = require('mongoose')
const Schema = mongoose.Schema

const professionSchema = new Schema({
    name: String,
    isAvailable: Boolean
})

module.exports = mongoose.model('Profession', professionSchema)