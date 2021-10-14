const { jwtService } = require('../services')
const { ROLES, STATES } = require('../config/constants')

const isAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: `No tienes autorizacion`, cod: 0 })
    }
    const token = req.headers.authorization.split(' ')[1]

    jwtService.decodeToken(token)
        .then(response => {
            const { roles, state } = response
            console.log('ROLES:', roles)
            console.log('STATE:', state)
            // let isEmployer = false
            // roles.forEach(x => {
            //     console.log({ role: x.role })
            //     if (x.role == ROLES.EMPLOYER) {
            //         isEmployer = true
            //     }
            // })
            const isEmployer = roles.filter(x => x.role == ROLES.EMPLOYER)
            console.log('isEmployer:', isEmployer)
            if (isEmployer && state == STATES.USER.AVAILABLE) {
                req.user = response
                next()
            } else {
                res.status(401).send({ message: 'Sin permisos' })
            }
        })
        .catch(error => {
            res.status(401).send({ message: 'Falló autenticacion de token' })
        })
}

module.exports = isAuth
