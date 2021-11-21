const { STATES } = require('../../config/constants')
const pushTemplate = {}

pushTemplate.changeStateUser = (body) => {
    return {
        title: `Actualización de usuario`,
        message: `Su usuario ha sido ${body.state == STATES.USER.AVAILABLE ? 'habilitado' : body.state == STATES.USER.REJECTED ? 'rechazado' : 'deshabilitado'}`
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

pushTemplate.paymentStripe = () => {
    return {
        title: 'Pituto pagado',
        message: `El pituto ha sido pagado con tarjeta de crédito, tu deposito será coordinado con administración`
    }
}

pushTemplate.paymentMoney = () => {
    return {
        title: 'Pituto pagado',
        message: 'El pituto ha sido pagado con efectivo'
    }
}

pushTemplate.changePassword = () => {
    return {
        title: 'Cambio de contraseña',
        message: 'Se ha cambiado la contraseña de tu usuario'
    }
}

pushTemplate.notification = (body) => {
    return {
        title: body.title,
        message: body.text
    }
}


module.exports = pushTemplate