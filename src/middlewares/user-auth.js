const { STATES } = require('../config/constants')
const { jwtService } = require('../services')
const { User } = require('../models')

const isAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: `No tienes autorizacion`, cod: 0 })
    }
    const token = req.headers.authorization.split(' ')[1]

    jwtService.decodeToken(token)
        .then(async (response) => {
            if (response.isAdmin) {
                req.user = response
                next()
            } else {
                const user = await User.findById(response.userId, { state: 1 })
                if (user && (user.state == STATES.USER.AVAILABLE || user.state == STATES.USER.APPLY_EMPLOYEE)) {
                    req.user = response
                    next()
                } else {
                    res.status(401).send({ message: 'No tiene permisos' })
                }
            }
        })
        .catch(error => {
            res.status(401).send({ message: 'Falló autenticacion de token' })
        })
}

module.exports = isAuth
