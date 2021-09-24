const express = require('express')
const router = express.Router()
const { communeCtrl } = require('../controllers')
const adminAuth = require('../middlewares/admin-auth')

router.post('/save', adminAuth, communeCtrl.save)
router.get('/get-communes', communeCtrl.getCommunes)
router.get('/filter-communes', adminAuth, communeCtrl.filterCommunes)
router.put('/update-state', adminAuth, communeCtrl.update)

module.exports = router