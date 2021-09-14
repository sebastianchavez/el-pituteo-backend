const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: String,
    router: String,
    isAvailable: Boolean,
    roles: [
        { role: String }
    ]
})

module.exports = mongoose.model('Menu', menuSchema)