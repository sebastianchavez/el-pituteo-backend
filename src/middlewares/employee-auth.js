const { jwtService } = require('../services')
const { ROLES, STATES } = require('../config/constants')
const { User } = require('../models')

const isAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: `No tienes autorizacion`, cod: 0 })
    }
    const token = req.headers.authorization.split(' ')[1]

    jwtService.decodeToken(token)
        .then(async (response) => {
            const user = await User.findById(response.userId, { state: 1, roles: 1 })
            console.log('user:', user)
            if (user && user.state == STATES.USER.AVAILABLE) {
                const isEmployee = user.roles.find(x => x.role == ROLES.EMPLOYEE)
                console.log('isEmployee:', isEmployee)
                if (isEmployee) {
                    req.user = response
                    next()
                } else {
                    res.status(403).send({ message: 'No tiene permisos', data: true })
                }
            } else if (user && user.state == STATES.USER.APPLY_EMPLOYEE) {
                res.status(403).send({ message: 'Ya tiene una postulación en curso', data: false })
            } else {
                if (!user) {
                    res.status(401).send({ message: 'No tiene permisos' })
                } else {
                    res.status(403).send({ message: 'No tiene permisos' })
                }
            }
        })
        .catch(error => {
            res.status(401).send({ message: 'Falló autenticacion de token' })
        })
}

module.exports = isAuth
