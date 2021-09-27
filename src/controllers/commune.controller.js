const { Commune } = require('../models')
const communeCtrl = {}

communeCtrl.save = async (req, res) => {
    try {
        const { region, name } = req.body
        const newCommune = new Commune({
            region,
            name,
            isAvailable: true
        })
        await newCommune.save()
        res.status(200).send({ message: 'Success', commune: newCommune })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

communeCtrl.getCommunes = async (req, res) => {
    try {
        const communes = await Commune.find({ isAvailable: true })
        res.status(200).send({ message: 'Success', communes })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

communeCtrl.filterCommunes = async (req, res) => {
    try {
        const { name, region, isAvailable } = req.query
        const criteria = {}
        criteria.$and = []
        if (name && name != '') {
            let regex = new RegExp('^' + name.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ name: option })
        }
        if (region && region != '') {
            let regex = new RegExp('^' + region.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ region: option })
        }
        if (isAvailable && isAvailable != 'null') {
            criteria.isAvailable = isAvailable
        }
        if (criteria.$and.length == 0) {
            delete criteria.$and
        }
        const communes = await Commune.find(criteria)
        res.status(200).send({ message: 'Success', communes })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

communeCtrl.update = async (req, res) => {
    try {
        const { _id, isAvailable } = req.body
        const dataToUpdate = {
            isAvailable
        }
        await Commune.findByIdAndUpdate(_id, { $set: dataToUpdate })
        res.status(200).send({ message: 'Comuna actualizada' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = communeCtrl