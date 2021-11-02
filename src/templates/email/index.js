const { STATES } = require('../../config/constants')
const emailTemplate = {}

emailTemplate.changeState = (body) => `
    <h1>El registro de su cuenta ha sido ${body.state == STATES.USER.AVAILABLE ? 'aceptado' : 'rechazado'}</h1>
`

emailTemplate.applyEmployee = (accept) => `
    <h1>Su solicitud de usuario apitutado a sido ${accept ? 'aceptada' : 'rechazada'}</h1>
`

module.exports = emailTemplate