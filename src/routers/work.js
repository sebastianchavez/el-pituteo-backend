const express = require('express')
const router = express.Router()
const { employerAuth, adminAuth } = require('../middlewares')
const { workCtrl } = require('../controllers')

router.post('/publish', employerAuth, workCtrl.publish)
router.put('/update-image', employerAuth, workCtrl.updateImage)
router.get('/filter', adminAuth, workCtrl.filter)
router.put('/update-state', adminAuth, workCtrl.updateState)

module.exports = router