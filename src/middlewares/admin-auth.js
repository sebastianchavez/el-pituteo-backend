const { jwtService } = require('../services')

const isAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: `No tienes autorizacion`, cod: 0 })
  }
  const token = req.headers.authorization.split(' ')[1]

  jwtService.decodeToken(token)
    .then(response => {
        req.user = response
        next()
    })
    .catch(error => {
      res.status(401).send({ message: 'Falló autenticacion de token' })
    })
}

module.exports = isAuth
