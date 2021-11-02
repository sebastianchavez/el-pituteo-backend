const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    title: String,
    message: Boolean,
    types: [
        {
            type: String
        }
    ],
    users: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User' }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('Notification', notificationSchema)