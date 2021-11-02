const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')
const { User, Work } = require('../models')
const { s3Service, emailService, oneSignalService, jwtService } = require('../services')
const { STATES, ROLES } = require('../config/constants')
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
                    userId: user._id,
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
        const { image, nameImage, idS3 } = req.body
        let obj = {
            path: `${idS3}/images/`,
            name: nameImage,
            image: image
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
        emailService.changeStateUser({ state: dataToUpdate.state, email: response.email })
            .catch(err => {
                console.log('Error al enviar email', err)
            })
        oneSignalService.sendPushResolutionRegister(pushId, dataToUpdate.state)
            .catch(err => {
                console.log('Error al enviar notifiación', err)
            })
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log('updateState - Error:', e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

userCtrl.applyEmployee = async (req, res) => {
    try {
        const { userId } = req.user
        const { files } = req.body
        const { certificateOfStudies, criminalRecord, otherFile, nameCertificateOfStudies, nameCriminalRecord, nameOtherFile } = files
        const user = await User.findById(userId)
        if (user.state = STATES.USER.APPLY_EMPLOYEE) {
            return res.status(400).send({ message: 'Ya cuenta con una solicitud en curso, debe esperar a resolución' })
        }
        let dataToUpdate = { ...user.files }
        if (certificateOfStudies && certificateOfStudies != '') {
            dataToUpdate.certificateOfStudies = certificateOfStudies
            dataToUpdate.nameCertificateOfStudies = nameCertificateOfStudies
        }
        if (criminalRecord && criminalRecord != '') {
            dataToUpdate.criminalRecord = criminalRecord
            dataToUpdate.nameCriminalRecord = nameCriminalRecord
        }
        if (otherFile && otherFile != '') {
            dataToUpdate.otherFile = otherFile
            dataToUpdate.nameOtherFile = nameOtherFile
        }
        await User.findByIdAndUpdate(userId, { $set: { files: dataToUpdate, state: STATES.USER.APPLY_EMPLOYEE } })
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log('applyEmployee - Error:', e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

userCtrl.updateApplyEmployee = async (req, res) => {
    try {
        const { accept, _id, pushId, email } = req.body
        let roles = [
            { role: ROLES.EMPLOYER }
        ]
        if (accept) {
            roles.push({ role: ROLES.EMPLOYEE })
        }
        await User.findByIdAndUpdate(_id, { $set: { state: STATES.USER.AVAILABLE }, roles })
        emailService.sendEmailApplyEmployee({ email, accept })
            .catch(err => {
                console.log('Error al enviar email', err)
            })
        oneSignalService.sendPushApplyEmployee(pushId, accept)
            .catch(err => {
                console.log('Error al enviar notifiación', err)
            })
        res.status(200).send({ message: 'Usuario actualizado con éxito' })
    } catch (e) {
        console.log('updateApplyEmployee - Error:', e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

userCtrl.getMyContacts = async (req, res) => {
    try {
        const { userId } = req.user
        const works = await Work.find({ $or: [{ userIdEmployer: userId }, { userIdEmployee: userId }] })
        let contacts = []
        for await (w of works) {
            contacts.push(w.userIdEmployer == userId ? w.userIdEmployee : w.userIdEmployer)
        }
        contacts = [...new Set(contacts)]
        const criteria = {
            _id: {
                $in: contacts
            }
        }
        const users = await User.find(criteria)
        res.status(200).send({ message: 'Success', users })
    } catch (e) {
        console.log('getMyContacts - Error:', e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = userCtrl