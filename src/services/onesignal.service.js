const fetch = require('node-fetch')
const { userTemplate } = require('../templates/push-notification')
const oneSignalService = {}
const { ONESIGNAL_URL, ONESIGNAL_APP_ID, ONESIGNAL_APIRESP } = process.env

oneSignalService.sendPushResolutionRegister = (toId, state) => {
    return new Promise(async (resolve, reject) => {
        const { title, message } = userTemplate.changeState({ state })
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

module.exports = oneSignalService