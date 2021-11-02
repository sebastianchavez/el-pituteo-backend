const mongoose = require('mongoose')
const Schema = mongoose.Schema

const communeSchema = new Schema({
    name: String,
    region: String,
    isAvailable: Boolean
}, {
    timestamps: true
})

module.exports = mongoose.model('Commune', communeSchema)