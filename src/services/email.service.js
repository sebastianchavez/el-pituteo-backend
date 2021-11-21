var nodemailer = require('nodemailer')
const { STATES } = require('../config/constants')
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
    subject: `Actualización de usuario`,
    html: emailTemplate.changeState(body)
  })
}

emailService.sendEmailApplyEmployee = (body) => {
  return transporter.sendMail({
    from: 'contacto@elpituteo.cl',
    to: body.email,
    subject: 'Resolución de solicitud apitutado',
    html: emailTemplate.applyEmployee(body.accept)
  })
}

emailService.sendEmailPaymentStripe = (body) => {
  return transporter.sendMail({
    from: 'contacto@elpituteo.cl',
    to: body.email,
    subject: 'Pituto completado',
    html: emailTemplate.paymentStripe()
  })
}

emailService.sendEmailPaymentMoney = (body) => {
  return transporter.sendMail({
    from: 'contacto@elpituteo.cl',
    to: body.email,
    subject: 'Pituto completado',
    html: emailTemplate.paymentMoney()
  })
}

emailService.sendEmailResolutionWork = (body) => {
  return transporter.sendMail({
    from: 'contacto@elpituteo.cl',
    to: body.email,
    subject: 'Resolución de pituto',
    html: emailTemplate.changeStateWork(body)
  })
}

emailService.sendEmailChangePassword = (body) => {
  return transporter.sendMail({
    from: 'contacto@elpituteo.cl',
    to: body.email,
    subject: 'Cambio de contraseña',
    html: emailTemplate.changePassword(body)
  })
}

emailService.sendEmailNotification = (body) => {
  return transporter.sendMail({
    from: 'contacto@elpituteo.cl',
    to: body.email,
    subject: 'Notificación El Pituteo',
    html: emailTemplate.notification(body)
  })
}

module.exports = emailService
