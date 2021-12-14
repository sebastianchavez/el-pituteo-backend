const { Profession } = require('../models')
const professionCtrl = {}

professionCtrl.save = async (req, res) => {
    try {
        const { name } = req.body
        const newProfession = new Profession({
            name,
            isAvailable: true
        })
        await newProfession.save()
        res.status(200).send({ message: 'Success', profession: newProfession })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

professionCtrl.getProfessions = async (req, res) => {
    try {
        const professions = await Profession.find({ isAvailable: true })
        res.status(200).send({ professions })
    } catch (e) {
        res.status(500).send({ message: 'Error', error: e })
    }
}

professionCtrl.filterProfessions = async (req, res) => {
    try {
        const { name, isAvailable, page, limit } = req.query
        const criteria = {
            $and: []
        }
        if (name && name != '') {
            let regex = new RegExp('^' + name.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ name: option })
        }
        if (isAvailable && isAvailable != '' && isAvailable != 'null') {
            criteria.isAvailable = isAvailable
        }
        if (criteria.$and.length == 0) {
            delete criteria.$and
        }
        let professions
        if (page && limit) {
            professions = await Profession.find(criteria).skip((parseFloat(page) * parseFloat(limit)) - parseFloat(limit)).limit(parseFloat(limit))
        } else {
            professions = await Profession.find(criteria)
        }
        const count = await Profession.countDocuments()
        res.status(200).send({ professions, count })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

professionCtrl.updateState = async (req, res) => {
    try {
        const { _id, isAvailable } = req.body
        const dataToUpdate = {
            isAvailable
        }
        await Profession.findByIdAndUpdate(_id, { $set: dataToUpdate })
        res.status(200).send({ message: 'Profesión actualizada' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = professionCtrl