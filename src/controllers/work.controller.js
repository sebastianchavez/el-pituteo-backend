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
        const { title, states, category, commune, startDate, endDate } = req.query
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
            { select: 'name', path: 'categoryId' },
            { select: 'name region', path: 'address.communeId' },
            { select: 'email', path: 'userIdEmployer' }
        ]
        const works = await Work.find(criteria).populate(populate)
        res.status(200).send({ message: 'Success', works })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.updateState = async (req, res) => {
    try {
        const { _id, accept } = req.body
        const state = accept ? STATES.WORK.AVAILABLE : STATES.WORK.REJECTED
        const work = await Work.findByIdAndUpdate(_id, { $set: { state } })
        const user = await User.findById(work.userIdEmployer)
        await oneSignalService.sendPushResolutionWork(user.pushId, state)
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = workCtrl