const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentMethodSchema = new Schema({
    code: String,
    name: String,
    description: String,
    isAvailable: Boolean
}, {
    timestamps: true
})

module.exports = mongoose.model('Paymentmethod', paymentMethodSchema)