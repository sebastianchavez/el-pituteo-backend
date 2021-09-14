const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workSchema = new Schema({
    userIdEmployee: { type: Schema.Types.ObjectId, ref: 'User' },
    userIdEmployer: { type: Schema.Types.ObjectId, ref: 'User' },
    direction: String,
    communeId: { type: Schema.Types.ObjectId, ref: 'Commune' },
    amount: Number,
    paymentMethodId: { type: Schema.Types.ObjectId, ref: 'Paymentmethod' },
    profession: { type: Schema.Types.ObjectId, ref: 'Profession' },
    state: String,
    title: String,
    description: String,
    payState: String,
    ratingEmployee: {
        rating: Number,
        comentary: String,
    },
    ratingEmployer: {
        rating: Number,
        comentary: String,
    },
    postulated: [
        { 
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            accepted: Boolean 
        }
    ]
},{
    timestamps: true
})

module.exports = mongoose.model('Work', workSchema)