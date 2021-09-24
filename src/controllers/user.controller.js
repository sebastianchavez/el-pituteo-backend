const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')
const { User } = require('../models')
const { s3Service } = require('../services')
const { STATES } = require('../config/constants')
const userCtrl = {}

userCtrl.register = async (req, res) => {
    try {
        const { address, communeId, rut, email, password, expiredDateCI, idS3, lastnames, nacionality, names, phone, pushId, files, professionId, roles } = req.body
        const newUser = new User({
            address,
            rut,
            email,
            communeId: mongoose.Types.ObjectId(communeId),
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            expiredDateCI: new Date(expiredDateCI),
            idS3,
            lastnames,
            nacionality, 
            names, 
            phone, 
            pushId, 
            files, 
            roles,
            professionId: mongoose.Types.ObjectId(professionId),
            state: STATES.USER.PENDING
        })
        await newUser.save()
        res.status(200).send({message: 'Usuario registrado'})
    } catch (e) {
        console.log('register - Error:', e)
        if(e.code && e.code == 11000){
            res.status(400).send({message: 'Este rut ya se encuentra registrado'})
        } else {
            res.status(500).send({message: 'Error'})
        }
    }
}

userCtrl.updateImage = async (req, res) => {
    try {
        const { image, nameImage, type, idS3 } = req.body
        // type = 'ci', 'user', 'permanence', 'studies', 'criminal', 'other', 'profile'
        let obj
            if (type == 'ci' || type == 'user' || type == 'permanence' || type == 'studies' || type == 'criminal' || type == 'other') {
                obj = {
                  path: `${idS3}/images/`,
                  name: nameImage,
                  image: image
                }
            }
        const response = await s3Service.saveImage(obj)
        res.status(200).send({ message: 'Success', url: response.Location })
    } catch (e) {
        console.log('updateImage - Error:', e)
        res.status(500).send({message: 'Error', error: e})
    }
}

userCtrl.filterUser = async (req, res) => {
    try {
        const { rut, email, isAvailable } = req.body
        const criteria = {}
        criteria.$and = []
        if(rut && rut != ''){
            let regex = new RegExp('^' + rut.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ rut: option })
        }
        if(email && email != ''){
            let regex = new RegExp('^' + email.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ email: option })
        }
        if(isAvailable && isAvailable != 'null'){
            criteria.isAvailable = isAvailable
        }
        if(criteria.$and.length == 0) {
            delete criteria.$and
        }
        console.log(criteria)
        const users = await User.find(criteria)
        res.status(200).send({message: 'Success', users})
    } catch (e) {
        console.log('filterUser - Error:', e)
        res.status(500).send({message: 'Error', error: e})
    }
}

userCtrl.updateState = async (req, res) => {
    try {
        const { _id, accepted } = req.body
        const dataToUpdate = {}
        if(accepted && accepted != 'null'){
            dataToUpdate.state = STATES.USER.AVAILABLE
        } else {
            dataToUpdate.state = STATES.USER.REJECTED
        }
        await User.findByIdAndUpdate(_id, dataToUpdate)
        res.status(200).send({message: 'Success'})
    } catch (e) {
        console.log('updateState - Error:', e)
        res.status(500).send({message: 'Error', error: e})
    }
}

module.exports = userCtrl