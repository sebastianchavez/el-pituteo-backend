const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    category: String,
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