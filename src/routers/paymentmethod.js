const express = require('express')
const router = express.Router()
const { paymentMethodCtrl } = require('../controllers')

router.get('/filter-payment-methods', paymentMethodCtrl.filter)
router.post('/save', paymentMethodCtrl.save)

module.exports = router