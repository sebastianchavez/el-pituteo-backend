const mongoose = require('mongoose')
const Schema = mongoose.Schema

const communeSchema = new Schema({
    region: String,
    name: String,
    isAvailable: Boolean
})

module.exports = mongoose.model('Commune', communeSchema)