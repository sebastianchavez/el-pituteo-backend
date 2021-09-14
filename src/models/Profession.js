const mongoose = require('mongoose')
const Schema = mongoose.Schema

const professionSchema = new Schema({
    profession: String,
    categories: [
        {
            category: String
        }
    ],
    isAvailable: Boolean
})

module.exports = mongoose.model('Profession', professionSchema)