const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: String,
    image: String,
    nameImage: String,
    icon: String,
    nameIcon: String,
    professions: [
        {
            professionId: { type: Schema.Types.ObjectId, ref: 'Profession' }
        }
    ],
    isAvailable: Boolean
})

module.exports = mongoose.model('Category', categorySchema)