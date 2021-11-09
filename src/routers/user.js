const express = require('express')
const router = express.Router()
const { userCtrl } = require('../controllers')
const { adminAuth, userAuth } = require('../middlewares')

router.post('/register', userCtrl.register)
router.post('/update-image', userCtrl.updateImage)
router.get('/filter-users', adminAuth, userCtrl.filterUser)
router.put('/update-state', adminAuth, userCtrl.updateState)
router.put('/login', userCtrl.login)
router.put('/apply-employee', userAuth, userCtrl.applyEmployee)
router.put('/update-apply', adminAuth, userCtrl.updateApplyEmployee)
router.get('/get-my-contacts', userAuth, userCtrl.getMyContacts)
router.get('/get-rating', userAuth, userCtrl.getRating)
router.put('/update-user', userAuth, userCtrl.updateUser)
router.put('/change-password', userAuth, userCtrl.changePassword)
router.get('/get-faqs', userCtrl.getFaqs)

module.exports = router