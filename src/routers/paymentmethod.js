const express = require('express')
const router = express.Router()
const adminAuth = require('../middlewares/admin-auth')
const { paymentMethodCtrl } = require('../controllers')

router.get('/get-payment-methods', paymentMethodCtrl.getPaymentMethods)
router.get('/filter-payment-methods', adminAuth, paymentMethodCtrl.filter)
router.post('/save', adminAuth, paymentMethodCtrl.save)
router.put('/update-state', adminAuth, paymentMethodCtrl.updateState)

module.exports = router