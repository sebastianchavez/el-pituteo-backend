const express = require('express')
const router = express.Router()
const { adminAuth } = require('../middlewares')
const { notificationCtrl } = require('../controllers')

router.put('/send-notification', adminAuth, notificationCtrl.sendNotification)

module.exports = router