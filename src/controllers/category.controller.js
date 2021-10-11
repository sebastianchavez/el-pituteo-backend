const mongoose = require('mongoose')
const { Category } = require('../models')
const { s3Service } = require('../services')
const categoryCtrl = {}

categoryCtrl.filter = async (req, res) => {
    try {
        const { name, isAvailable } = req.query
        const criteria = {}
        criteria.$and = []
        if (name && name != '') {
            let regex = new RegExp('^' + name.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ name: option })
        }
        if (isAvailable && isAvailable != 'null') {
            criteria.isAvailable = isAvailable
        }
        if (criteria.$and.length == 0) {
            delete criteria.$and
        }
        const categories = await Category.find(criteria)
        res.status(200).send({ message: 'Success', categories })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

categoryCtrl.save = async (req, res) => {
    try {
        const { name, image, nameImage, icon, nameIcon, professions, isAvailable } = req.body
        const newCategory = new Category({
            name,
            image,
            nameImage,
            icon,
            nameIcon,
            professions,
            isAvailable
        })
        await newCategory.save()
        res.status(200).send({ message: 'Success', category: newCategory })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

categoryCtrl.updateState = async (req, res) => {
    try {
        const { _id, isAvailable } = req.body
        await Category.findByIdAndUpdate(_id, { $set: { isAvailable } })
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

categoryCtrl.updateImage = async (req, res) => {
    try {
        const { imageName, image, type } = req.body
        const request = {
            image,
            name: imageName,
            path: ''
        }
        if (type && type == 'img') {
            request['path'] = 'categories/images/'
        } else {
            request['path'] = 'categories/icons/'
        }
        const response = await s3Service.saveImage(request)
        res.status(200).send({ message: 'Success', url: response.Location })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

categoryCtrl.updateProfessions = async (req, res) => {
    try {
        const { _id, professions } = req.body
        if (professions.length > 0) {
            const professionList = []
            professions.forEach(x => {
                professionList.push({ professionId: mongoose.Types.ObjectId(x) })
            })
            console.log(professionList)
            await Category.findByIdAndUpdate(_id, { $set: { professions: professionList } })
            res.status(200).send({ message: 'Profesiones actualizadas' })
        } else {
            res.status(400).send({ message: 'Debe seleccionar al menos una profesión' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

categoryCtrl.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isAvailable: true })
        res.status(200).send({ message: 'Success', categories })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = categoryCtrl