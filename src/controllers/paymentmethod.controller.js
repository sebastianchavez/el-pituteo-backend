const { PaymentMethod } = require('../models')
const Paymentmethod = require('../models/Paymentmethod')
const paymentMethodCtrl = {}

paymentMethodCtrl.filter = async (req, res) => {
    try {
        const { name, code, isAvailable } = req.query
        console.log(req.query)
        const criteria = {}
        criteria.$and = []
        if (name && name != '') {
            let regex = new RegExp('^' + name.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ name: option })
        }
        if (code && code != '') {
            let regex = new RegExp('^' + code.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ code: option })
        }
        if (isAvailable && isAvailable != 'null' && isAvailable != 'undefined') {
            criteria.isAvailable = isAvailable
        }
        if (criteria.$and.length == 0) {
            delete criteria.$and
        }
        const paymentMethods = await PaymentMethod.find(criteria)
        res.status(200).send({ message: 'Success', paymentMethods })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

paymentMethodCtrl.save = async (req, res) => {
    try {
        const { code, name, description, isAvailable } = req.body
        const newPaymentMethod = new PaymentMethod({
            code, name, description, isAvailable
        })
        await newPaymentMethod.save()
        res.status(200).send({ message: 'Success', paymentMethod: newPaymentMethod })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

paymentMethodCtrl.updateState = async (req, res) => {
    try {
        const { _id, isAvailable } = req.body
        await Paymentmethod.findByIdAndUpdate(_id, { $set: { isAvailable } })
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

paymentMethodCtrl.getPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await Paymentmethod.find({ isAvailable: true })
        res.status(200).send({ message: 'Success', paymentMethods })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = paymentMethodCtrl