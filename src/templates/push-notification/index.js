const { STATES } = require('../../config/constants')
const pushTemplate = {}

pushTemplate.changeStateUser = (body) => {
    return {
        title: 'Resolución de registro de usuario',
        message: `El registro de su cuenta ha sido ${body.state == STATES.USER.AVAILABLE ? 'aceptado' : 'rechazado'}`
    }
}

pushTemplate.changeStateWork = (body) => {
    return {
        title: 'Resolución de pituto',
        message: `Tu pituto ha sido ${body.state == STATES.WORK.AVAILABLE ? 'aceptado' : 'rechazado'}`
    }
}

pushTemplate.applyWork = () => {
    return {
        title: 'Postulación',
        message: `Usuario ha postulado a tu publicación`
    }
}

pushTemplate.applyEmployee = (accept) => {
    return {
        title: 'Resolución apitutado',
        message: `Su solicitud de usuario apitutado a sido ${accept ? 'aceptada' : 'rechazada'}`
    }
}


module.exports = pushTemplate