const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workSchema = new Schema({
    userIdEmployee: { type: Schema.Types.ObjectId, ref: 'User' },
    userIdEmployer: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    paymentMethodId: { type: Schema.Types.ObjectId, ref: 'Paymentmethod' },
    profession: { type: Schema.Types.ObjectId, ref: 'Profession' },
    state: String,
    title: String,
    description: String,
    address : {
        address: String,
        communeId: { type: Schema.Types.ObjectId, ref: 'Commune' },
    },
    payTransfer: {
        payState: String,
        payTransferImage: String,
        namePayTransferImage: String,
        payDate: Date,
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
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            accepted: Boolean,
            applicantedDate: Date,
            acceptedDate: Date,
        }
    ],
    reasonReject: String,
    comentaryReject: String,
    finish: Date
},{
    timestamps: true
})

module.exports = mongoose.model('Work', workSchema)