const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    rut: { type: String, unique: true },
    password: String,
    names: String,
    lastnames: String,
    direction: String,
    communeId: { type: Schema.Types.ObjectId, ref: 'Commune' },
    phone: Number,
    email: String,
    expiredDateCI: Date,
    nacionality: String,
    professionId: { type: Schema.Types.ObjectId, ref: 'Profession' },
    state: String,
    pushId: String,
    files: {
        imageCI: String,
        nameImageCI: String,
        imageUser: String,
        nameImageUser: String,
        certificateOfPermanence: String,
        nameCertificateOfPermanence: String,
        certificateOfStudies: String,
        nameCertificateOfStudies: String,
        criminalRecord: String,
        nameCriminalRecord: String,
        otherFile: String,
        nameOtherFile: String,
        imageProfile: String,
        nameImageProfile: String,
    },
    roles: [
        {
            role: String
        }
    ],
    rating: {
        rating: { type: Number, index: true, default: 0 },
        numberOfPeopleRated: { type: Number, default: 0 },
        totalRating: { type: Number, default: 0 },
    },
    accountBank: {
        bank: String,
        typeAccount: String,
        numberAccount: Number
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)