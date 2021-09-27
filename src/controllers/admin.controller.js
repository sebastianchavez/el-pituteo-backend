const bcrypt = require('bcrypt-nodejs')
const { Admin } = require('../models')
const { jwtService } = require('../services')
const adminCtrl = {}

adminCtrl.register = async (req, res) => {
    try {
        const { email, password } = req.body
        const newAdmin = new Admin({
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        })
        await newAdmin.save()
        res.status(200).send({ message: 'Admin registrado con éxito' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

adminCtrl.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email })
        if (admin) {
            const token = jwtService.createToken(admin)
            const passwordIsValid = bcrypt.compareSync(password, admin.password)
            if (passwordIsValid) {
                return res.status(200).send({ message: 'Admin autenticado', token })
            }
        }
        return res.status(400).send({ message: 'Email o contraseña son incorrectas' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = adminCtrl