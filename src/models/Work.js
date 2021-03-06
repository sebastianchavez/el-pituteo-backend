const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workSchema = new Schema({
    userIdEmployee: { type: Schema.Types.ObjectId, ref: 'User' }, // apitutado
    userIdEmployer: { type: Schema.Types.ObjectId, ref: 'User' }, // apitutador
    amount: Number,
    paymentMethodId: { type: Schema.Types.ObjectId, ref: 'Paymentmethod' },
    state: String,
    title: String,
    description: String,
    image: String,
    imageName: String,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    address: {
        address: String,
        communeId: { type: Schema.Types.ObjectId, ref: 'Commune' },
        latitude: Number,
        longitude: Number,
    },
    ratingEmployee: {
        rating: Number,
        comentary: String,
    },
    ratingEmployer: {
        rating: Number,
        comentary: String,
    },
    applicants: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User' }, // apitutado
            accepted: Boolean,
            applicantedDate: Date,
            acceptedDate: Date,
        }
    ],
    resolution: String,
    paymentState: String, // STRIPE
    isDeposited: Boolean, // STRIPE
    finishDate: Date,
    depositDate: Date, // STRIPE
    stripeId: String // STRIPE
}, {
    timestamps: true
})

module.exports = mongoose.model('Work', workSchema)