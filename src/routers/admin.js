const express = require('express')
const router = express.Router()
const { adminCtrl } = require('../controllers')

// Registro de admin
router.post('/register', adminCtrl.register)

router.post('/login', adminCtrl.login)

module.exports = router