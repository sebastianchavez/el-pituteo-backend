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
    imageCI: String,
    nameImageCI: String,
    imageUser: String,
    nameImageUser: String,
    expiredDate: Date,
    nacionality: String,
    certificateOfPermanence: String,
    nameCertificateOfPermanence: String,
    profession: String,
    certificateOfStudies: String,
    nameCertificateOfStudies: String,
    criminalRecord: String,
    nameCriminalRecord: String,
    otherFile: String,
    nameOtherFile: String,
    imageProfile: String,
    nameImageProfile: String,
    isAvailable: Boolean,
    profiles: [
        {
            profile: String
        }
    ],
    rating: { type: Number, index: true, default: 0 },
    numberOfPeopleRated: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)