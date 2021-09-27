const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')
const { User } = require('../models')
const { s3Service, emailService, oneSignalService, jwtService } = require('../services')
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
        res.status(200).send({ message: 'Usuario registrado' })
    } catch (e) {
        console.log('register - Error:', e)
        if (e.code && e.code == 11000) {
            res.status(400).send({ message: 'Este rut ya se encuentra registrado' })
        } else {
            res.status(500).send({ message: 'Error' })
        }
    }
}

userCtrl.login = async (req, res) => {
    try {
        const { rut, password, pushId } = req.body
        const user = await User.findOne({ rut })
        if (user) {

            if (pushId && pushId != '') {
                await User.findByIdAndUpdate(user._id, { $set: { pushId } })
            }
            if (user.state == STATES.USER.PENDING) {
                return res.status(400).send({ message: 'Usuario pendiente a revisión' })
            }

            if (user.state == STATES.USER.REJECTED) {
                return res.status(400).send({ message: 'Su registro ha sido rechazado' })
            }

            const token = jwtService.createTokenUser(user)
            const passwordIsValid = bcrypt.compareSync(password, user.password)
            if (passwordIsValid) {
                let userResponse = {
                    names: user.names,
                    lastnames: user.lastnames,
                    nacionality: user.nacionality,
                    idS3: user.idS3,
                    pushId: user.pushId,
                    phone: user.phone,
                    state: user.state,
                    professionId: user.professionId,
                    roles: user.roles,
                    rut: user.rut,
                    email: user.email,
                    rating: user.rating,
                    address: user.address,
                    communeId: user.communeId,
                    files: user.files
                }
                return res.status(200).send({ message: 'Usuario autenticado', token, user: userResponse })
            }
        }
        return res.status(400).send({ message: 'Email o contraseña son incorrectas' })
    } catch (e) {
        console.log('login - Error:', e)
        res.status(500).send({ message: 'Error' })
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
        res.status(500).send({ message: 'Error', error: e })
    }
}

userCtrl.filterUser = async (req, res) => {
    try {
        const { rut, email, states } = req.query
        const criteria = {}
        criteria.$and = []
        if (rut && rut != '') {
            let regex = new RegExp('^' + rut.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ rut: option })
        }
        if (email && email != '') {
            let regex = new RegExp('^' + email.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ email: option })
        }
        if (criteria.$and.length == 0) {
            delete criteria.$and
        }
        if (states && states != '') {
            criteria.state = { $in: states.split(',') }
        }
        const users = await User.find(criteria)
        res.status(200).send({ message: 'Success', users })
    } catch (e) {
        console.log('filterUser - Error:', e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

userCtrl.updateState = async (req, res) => {
    try {
        const { _id, accepted, pushId } = req.body
        const dataToUpdate = {}
        if (accepted && accepted != 'null') {
            dataToUpdate.state = STATES.USER.AVAILABLE
        } else {
            dataToUpdate.state = STATES.USER.REJECTED
        }
        const response = await User.findByIdAndUpdate(_id, dataToUpdate)
        await emailService.changeStateUser({ state: dataToUpdate.state, email: response.email })
        await oneSignalService.sendPushResolutionRegister(pushId, dataToUpdate.state)
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log('updateState - Error:', e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = userCtrl