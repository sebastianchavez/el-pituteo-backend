const { STATES } = require('../../config/constants')
const pushTemplate = {}

pushTemplate.changeState = (body) => {
    return {
        title: 'Resolución de pituto',
        message: `Tu pituto ha sido ${body.state == STATES.WORK.AVAILABLE ? 'aceptado' : 'rechazado'}`
    }
}

module.exports = pushTemplate
