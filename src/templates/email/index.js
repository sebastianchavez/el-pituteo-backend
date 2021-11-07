const { STATES } = require('../../config/constants')
const emailTemplate = {}

emailTemplate.changeState = (body) => `
    <h1>El registro de su cuenta ha sido ${body.state == STATES.USER.AVAILABLE ? 'aceptado' : 'rechazado'}</h1>
`

emailTemplate.applyEmployee = (accept) => `
    <h1>Su solicitud de usuario apitutado a sido ${accept ? 'aceptada' : 'rechazada'}</h1>
`

emailTemplate.paymentStripe = () => `
    <h1>Pituto completado</h1>
    <h3>El pituto ha sido pagado con tarjeta de crédito, tu deposito será coordinado con administración</h3>
`

emailTemplate.paymentMoney = () => `
    <h1>Pituto completado</h1>
    <h3>El pituto ha sido pagado con efectivo</h3>
`
module.exports = emailTemplate