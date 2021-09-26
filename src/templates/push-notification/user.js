const { STATES } = require('../../config/constants')
const pushTemplate = {}

pushTemplate.changeState = (body) => {
    return {
        title: 'Resolución de registro de usuario',
        message: `El registro de su cuenta ha sido ${body.state == STATES.USER.AVAILABLE ? 'aceptado': 'rechazado' }`
    }
}

module.exports = pushTemplate