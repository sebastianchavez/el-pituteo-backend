const express = require('express')
const router = express.Router()
const { userCtrl } = require('../controllers')

router.post('/register', userCtrl.register)
router.post('/update-image', userCtrl.updateImage)
router.get('/filter-users', userCtrl.filterUser)
router.put('/update-state', userCtrl.updateState)

module.exports = router