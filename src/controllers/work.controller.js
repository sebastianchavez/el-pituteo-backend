const mongoose = require('mongoose')
const { Work } = require('../models')
const { s3Service } = require('../services')
const { STATES } = require('../config/constants')
const workCtrl = {}

workCtrl.publish = async (req, res) => {
    try {
        const { title, description, amount, paymentmethod, image, imageName, commune, direction, category } = req.body
        const { userId } = req.user
        console.log(req.body)
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

module.exports = workCtrl