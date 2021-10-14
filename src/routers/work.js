const express = require('express')
const router = express.Router()
const { employerAuth } = require('../middlewares')
const { workCtrl } = require('../controllers')

router.post('/publish', employerAuth, workCtrl.publish)
router.put('/update-image', employerAuth, workCtrl.updateImage)

module.exports = router