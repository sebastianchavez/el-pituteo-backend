

const { Work } = require('../models')
const workCtrl = {}

workCtrl.publish = async (req, res) => {
    try {

    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = workCtrl