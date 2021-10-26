var nodemailer = require('nodemailer')
const emailTemplate = require('../templates/email')
const { EMAIL_USER, EMAIL_PASSWORD } = process.env

const emailService = {}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  },
})

emailService.changeStateUser = (body) => {
  return transporter.sendMail({
    from: 'contacto@elpituteo.cl',
    to: body.email,
    subject: 'Resolución de registro de usuario',
    html: emailTemplate.changeState(body)
  })
}

module.exports = emailService
