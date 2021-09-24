const jwt = require('jwt-simple')
const moment = require('moment')
const { SECRET_TOKEN } = process.env

const createToken = (user) => {
  const payload = {
    sub: {
      userId: user._id,
      email: user.email
    },
    iat: moment().unix(),
    exp: moment().add(1, 'day').unix()
  }

  return jwt.encode(payload, SECRET_TOKEN)
}

const decodeToken = (token) => {
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

module.exports = {
  createToken,
  decodeToken
}
