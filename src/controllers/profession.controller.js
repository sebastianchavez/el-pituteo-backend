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
        res.status(200).send({message: 'Success', profession: newProfession})
    } catch (e) {
        console.log(e)
        res.status(500).send({message: 'Error', error: e})
    }
}

professionCtrl.getProfessions = async (req, res) => {
    try {
        const professions = await Profession.find({isAvailable: true})
        res.status(200).send({professions})
    } catch (e) {
        res.status(500).send({message: 'Error', error: e})
    }
}

module.exports = professionCtrl