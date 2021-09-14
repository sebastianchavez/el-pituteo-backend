const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: String,
    router: String,
    isAvailable: Boolean
})

module.exports = mongoose.model('Menu', menuSchema)