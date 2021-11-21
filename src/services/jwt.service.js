const jwt = require('jwt-simple')
const moment = require('moment')
const { SECRET_TOKEN } = process.env
const jwtService = {}

jwtService.createToken = (user) => {
  const payload = {
    sub: {
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin ? true : false
    },
    iat: moment().unix(),
    exp: moment().add(1, 'day').unix()
  }

  return jwt.encode(payload, SECRET_TOKEN)
}

jwtService.createTokenUser = (user) => {
  const payload = {
    sub: {
      userId: user._id,
      email: user.email,
      roles: user.roles,
      phone: user.phone,
      state: user.state,
      idS3: user.idS3
    },
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  }

  return jwt.encode(payload, SECRET_TOKEN)
}

jwtService.decodeToken = (token) => {
  const decode = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, SECRET_TOKEN)
      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'El Token ha expirado'
        })
      }
      resolve(payload.sub)
    } catch (e) {
      reject({
        status: 500,
        message: e.message
      })
    }
  })
  return decode
}

module.exports = jwtService