const mongoose = require('mongoose')
const Schema = mongoose.Schema

const communeSchema = new Schema({
    name: String,
    region: String,
    isAvailable: Boolean
})

module.exports = mongoose.model('Commune', communeSchema)