const { Notification, User } = require('../models')
const { emailService, oneSignalService } = require('../services')
const mongoose = require('mongoose')
const { TYPES, STATES } = require('../config/constants')
const notificationCtrl = {}

notificationCtrl.sendNotification = async (req, res) => {
    try {
        const { roles, communes, types, title, text } = req.body

        const criteria = {
            state: STATES.USER.AVAILABLE
        }
        if (roles && roles.length > 0) {
            criteria['roles.role'] = { $in: roles }
        }
        if (communes && communes.length > 0) {
            criteria['communeId'] = { $in: communes }
        }

        const users = await User.find(criteria)
        const formatUsers = []
        const formatTypes = []
        let formatEmail = ''
        let index = 0
        for await (let u of users) {
            formatUsers.push({ userId: mongoose.Types.ObjectId(u._id) })
            formatEmail += u.email
            if (index <= users.length) {
                formatEmail += ','
            }
            index++
        }
        if (types && types.email) {
            formatTypes.push({ type: TYPES.NOTIFICATION.EMAIL })
        }
        if (types && types.push) {
            formatTypes.push({ type: TYPES.NOTIFICATION.PUSH })
        }
        const pushIds = []
        for await (let u of users) {
            if (u.pushId) {
                pushIds.push(u.pushId)
            }
        }

        emailService.sendEmailNotification({ email: formatEmail, title, text })
            .catch(error => {
                console.log('Error - email', error)
            })

        oneSignalService.sendNotificationFromAdmin({ title, text }, pushIds)
            .catch(error => {
                console.log('Error - onesignal', error)
            })

        setTimeout(async () => {
            const newNotification = new Notification({
                title,
                message: text,
                types: formatTypes,
                users: formatUsers
            })

            await newNotification.save()

            res.status(200).send({ message: 'Success' })
        }, 2000)
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

module.exports = notificationCtrl