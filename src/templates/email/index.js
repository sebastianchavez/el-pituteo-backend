const { STATES } = require('../../config/constants')
const emailTemplate = {}

emailTemplate.changeState = (body) => `
    <h1>Su usuario ha sido ${body.state == STATES.USER.AVAILABLE ? 'habilitado' : body.state == STATES.USER.REJECTED ? 'rechazado' : 'deshabilitado'}</h1>
`

emailTemplate.applyEmployee = (accept) => `
    <h1>Su solicitud de usuario apitutado a sido ${accept ? 'aceptada' : 'rechazada'}</h1>
`

emailTemplate.changeStateWork = (body) => `
        <h1>Tu pituto ha sido ${body.state == STATES.WORK.AVAILABLE ? 'aceptado' : 'rechazado'}</h1>
`


emailTemplate.paymentStripe = () => `
    <h1>Pituto completado</h1>
    <h3>El pituto ha sido pagado con tarjeta de crédito, tu deposito será coordinado con administración</h3>
`

emailTemplate.paymentMoney = () => `
    <h1>Pituto completado</h1>
    <h3>El pituto ha sido pagado con efectivo</h3>
`

emailTemplate.changePassword = (body) => `
    <h1>Cambio de contraseña</h1>
    <h3>Se ha generado un cambio de contraseña</h3>
    <h3>Su nueva contraseña es: "${body.password}"</h3>
`

emailTemplate.notification = (body) => `
    <h3>${body.title}</h3>
    <p>${body.text}</p>
`

module.exports = emailTemplate