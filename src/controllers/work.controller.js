const mongoose = require('mongoose')
const { Work, User } = require('../models')
const { s3Service, oneSignalService } = require('../services')
const { STATES } = require('../config/constants')
const workCtrl = {}

workCtrl.publish = async (req, res) => {
    try {
        const { title, description, amount, paymentmethod, image, imageName, commune, direction, category } = req.body
        const { userId } = req.user
        const dataToSave = {
            title,
            description,
            amount,
            paymentMethodId: mongoose.Types.ObjectId(paymentmethod),
            image,
            imageName,
            categoryId: mongoose.Types.ObjectId(category),
            address: {
                address: direction,
                communeId: mongoose.Types.ObjectId(commune),
            },
            userIdEmployer: mongoose.Types.ObjectId(userId),
            state: STATES.WORK.PENDING
        }
        const newWork = new Work(dataToSave)
        await newWork.save()
        res.status(200).send({ message: 'Success', work: newWork })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.updateImage = async (req, res) => {
    try {
        const { image, nameImage } = req.body
        const { idS3 } = req.user

        const obj = {
            image,
            name: nameImage,
            path: `${idS3}/works/`,
        }
        const response = await s3Service.saveImage(obj)
        res.status(200).send({ message: 'Success', url: response.Location })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.filter = async (req, res) => {
    try {
        const { title, states, category, commune, startDate, endDate, page, limit } = req.query
        let criteria = {}
        criteria.$and = []
        if (title && title != '') {
            let regex = new RegExp('^' + title.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ title: option })
        }
        if (states && states != '') {
            criteria.state = { $in: states.split(',') }
        }
        if (category && category != '') {
            criteria.categoryId = { $in: category.split(',') }
        }
        if (commune && commune != '') {
            criteria['address.communeId'] = { $in: commune.split(',') }
        }
        if (startDate && startDate != '' && endDate && endDate != '') {
            let end = new Date(endDate)
            let start = new Date(startDate)
            end.setHours(23)
            end.setMinutes(59)
            end.setSeconds(59)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(1)
            criteria.createdAt = { $gte: start, $lte: end }
        }
        if (criteria.$and.length == 0) {
            delete criteria.$and
        }

        const populate = [
            { select: 'name', path: 'paymentMethodId' },
            { select: 'name icon image', path: 'categoryId' },
            { select: 'name region', path: 'address.communeId' },
            { select: 'email', path: 'userIdEmployer' }
        ]
        let works
        if (limit && parseFloat(limit) > 0) {
            works = await Work.find(criteria).skip((parseFloat(page) * parseFloat(limit)) - parseFloat(limit)).populate(populate).sort({ createdAt: -1 }).limit(parseFloat(limit))
        } else {
            works = await Work.find(criteria).populate(populate).sort({ createdAt: -1 })
        }

        res.status(200).send({ message: 'Success', works })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.updateState = async (req, res) => {
    try {
        const { _id, accept, resolution } = req.body
        const state = accept ? STATES.WORK.AVAILABLE : STATES.WORK.REJECTED
        const work = await Work.findByIdAndUpdate(_id, { $set: { state, resolution } })
        const user = await User.findById(work.userIdEmployer)
        await oneSignalService.sendPushResolutionWork(user.pushId, state)
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.applyWork = async (req, res) => {
    try {
        const { userId } = req.user
        const { _id, userIdEmployer } = req.body
        if (userId == userIdEmployer._id) {
            res.status(400).send({ message: 'No puede postular a su propia publicación' })
        } else {
            const work = await Work.findById(_id)
            let flag = work.applicants.find(x => x.userId == userId)
            if (flag) {
                res.status(400).send({ message: 'Ya postulaste a este pituto' })
            } else {
                const applicant = {
                    userId: mongoose.Types.ObjectId(userId),
                    applicantedDate: new Date(),
                }
                const user = await User.findById(userIdEmployer)
                await Work.findByIdAndUpdate(_id, { $addToSet: { applicants: applicant } })
                await oneSignalService.sendPushApplyWork(user.pushId, _id)
                res.status(200).send({ message: 'Postulación realizada con éxito' })
            }
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.getWorkById = async (req, res) => {
    try {
        const { id } = req.query
        const populate = [
            { select: 'email names files', path: 'applicants.userId' },
            { select: 'email names files', path: 'userIdEmployee' },
            { select: 'email names files', path: 'userIdEmployer' },
        ]
        const work = await Work.findById(id).populate(populate)
        res.status(200).send({ message: 'Success', work })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.acceptApplicant = async (req, res) => {
    try {
        const { _id, workId } = req.body
        await Work.findByIdAndUpdate(workId, { $set: { state: STATES.WORK.IN_PROGRESS, userIdEmployee: mongoose.Types.ObjectId(_id) } })
        res.status(200).send({ message: 'Apitutado aceptado con éxito' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.getMyWorks = async (req, res) => {
    try {
        const { userId } = req.user
        const populate = [
            { select: 'name', path: 'paymentMethodId' },
            { select: 'name icon image', path: 'categoryId' },
            { select: 'name region', path: 'address.communeId' },
            { select: 'email', path: 'userIdEmployer' }
        ]

        const works = await Work.find({ $or: [{ userIdEmployer: userId }, { userIdEmployee: userId }] }).sort({ createdAt: -1 }).populate(populate)
        res.status(200).send({ message: 'Success', works })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.complete = async (req, res) => {
    try {
        const { _id } = req.body
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.cancel = async (req, res) => {
    try {
        const { _id } = req.body
        await Work.findByIdAndUpdate(_id, { $set: { state: STATES.WORK.CANCELED } })
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = workCtrl