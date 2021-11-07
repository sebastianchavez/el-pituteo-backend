const fetch = require('node-fetch')
const pushTemplate = require('../templates/push-notification')
const oneSignalService = {}
const { ACTIONS } = require('../config/constants')
const { ONESIGNAL_URL, ONESIGNAL_APP_ID, ONESIGNAL_APIRESP } = process.env

oneSignalService.sendPushResolutionRegister = (toId, state) => {
    return new Promise(async (resolve, reject) => {
        const { title, message } = pushTemplate.changeStateUser({ state })
        const key = `Basic ${ONESIGNAL_APIRESP}`
        const body = {
            "app_id": ONESIGNAL_APP_ID,
            "data": {},
            "contents": { "es": message, "en": message },
            "headings": { "es": title, "en": title },
            "include_player_ids": [toId]
        }
        fetch(`${ONESIGNAL_URL}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { Authorization: key, 'Content-Type': 'application/json' }
        }).then(res => res.json())
            .then(json => {
                if (json.error || json.errors) {
                    reject(json)
                } else {
                    resolve(json)
                }
            })
            .catch(err => {
                console.log('ERROR ONESIGNAL:', err)
                reject(err)
            })
    })
}

oneSignalService.sendPushResolutionWork = (toId, state) => {
    return new Promise(async (resolve, reject) => {
        const { title, message } = pushTemplate.changeStateWork({ state })
        const key = `Basic ${ONESIGNAL_APIRESP}`
        const body = {
            "app_id": ONESIGNAL_APP_ID,
            "data": {},
            "contents": { "es": message, "en": message },
            "headings": { "es": title, "en": title },
            "include_player_ids": [toId]
        }
        fetch(`${ONESIGNAL_URL}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { Authorization: key, 'Content-Type': 'application/json' }
        }).then(res => res.json())
            .then(json => {
                if (json.error || json.errors) {
                    reject(json)
                } else {
                    resolve(json)
                }
            })
            .catch(err => {
                console.log('ERROR ONESIGNAL:', err)
                reject(err)
            })
    })
}

oneSignalService.sendPushApplyWork = (toId, workId) => {
    return new Promise(async (resolve, reject) => {
        const { title, message } = pushTemplate.applyWork()
        const key = `Basic ${ONESIGNAL_APIRESP}`
        const body = {
            "app_id": ONESIGNAL_APP_ID,
            "data": {
                action: ACTIONS.APPLY_WORK,
                workId
            },
            "contents": { "es": message, "en": message },
            "headings": { "es": title, "en": title },
            "include_player_ids": [toId]
        }
        fetch(`${ONESIGNAL_URL}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { Authorization: key, 'Content-Type': 'application/json' }
        }).then(res => res.json())
            .then(json => {
                if (json.error || json.errors) {
                    reject(json)
                } else {
                    resolve(json)
                }
            })
            .catch(err => {
                console.log('ERROR ONESIGNAL:', err)
                reject(err)
            })
    })
}

oneSignalService.sendPushApplyEmployee = (toId, accept) => {
    return new Promise(async (resolve, reject) => {
        const { title, message } = pushTemplate.applyEmployee(accept)
        const key = `Basic ${ONESIGNAL_APIRESP}`
        const body = {
            "app_id": ONESIGNAL_APP_ID,
            "data": {
                action: ACTIONS.APPLY_EMPLOYEE,
                accept
            },
            "contents": { "es": message, "en": message },
            "headings": { "es": title, "en": title },
            "include_player_ids": [toId]
        }
        fetch(`${ONESIGNAL_URL}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { Authorization: key, 'Content-Type': 'application/json' }
        }).then(res => res.json())
            .then(json => {
                if (json.error || json.errors) {
                    reject(json)
                } else {
                    resolve(json)
                }
            })
            .catch(err => {
                console.log('ERROR ONESIGNAL:', err)
                reject(err)
            })
    })
}


oneSignalService.sendPushPaymentStripe = (toId) => {
    return new Promise(async (resolve, reject) => {
        const { title, message } = pushTemplate.paymentStripe()
        const key = `Basic ${ONESIGNAL_APIRESP}`
        const body = {
            "app_id": ONESIGNAL_APP_ID,
            "data": {
                action: ACTIONS.PAYMENT,
                title, message
            },
            "contents": { "es": message, "en": message },
            "headings": { "es": title, "en": title },
            "include_player_ids": [toId]
        }
        fetch(`${ONESIGNAL_URL}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { Authorization: key, 'Content-Type': 'application/json' }
        }).then(res => res.json())
            .then(json => {
                if (json.error || json.errors) {
                    reject(json)
                } else {
                    resolve(json)
                }
            })
            .catch(err => {
                console.log('ERROR ONESIGNAL:', err)
                reject(err)
            })
    })
}


oneSignalService.sendPushPaymentMoney = (toId) => {
    return new Promise(async (resolve, reject) => {
        const { title, message } = pushTemplate.paymentMoney()
        const key = `Basic ${ONESIGNAL_APIRESP}`
        const body = {
            "app_id": ONESIGNAL_APP_ID,
            "data": {
                action: ACTIONS.PAYMENT,
                title, message
            },
            "contents": { "es": message, "en": message },
            "headings": { "es": title, "en": title },
            "include_player_ids": [toId]
        }
        fetch(`${ONESIGNAL_URL}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { Authorization: key, 'Content-Type': 'application/json' }
        }).then(res => res.json())
            .then(json => {
                if (json.error || json.errors) {
                    reject(json)
                } else {
                    resolve(json)
                }
            })
            .catch(err => {
                console.log('ERROR ONESIGNAL:', err)
                reject(err)
            })
    })
}

module.exports = oneSignalService