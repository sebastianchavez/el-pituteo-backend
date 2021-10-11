const express = require('express')
const router = express.Router()
const adminAuth = require('../middlewares/admin-auth')
const { categoryCtrl } = require('../controllers')

router.get('/get-categories', categoryCtrl.getCategories)
router.get('/filter', adminAuth, categoryCtrl.filter)
router.post('/save', adminAuth, categoryCtrl.save)
router.put('/update-state', adminAuth, categoryCtrl.updateState)
router.put('/update-image', adminAuth, categoryCtrl.updateImage)
router.put('/update-professions', adminAuth, categoryCtrl.updateProfessions)

module.exports = router