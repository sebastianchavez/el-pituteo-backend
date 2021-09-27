const express = require('express')
const router = express.Router()
const adminAuth = require('../middlewares/admin-auth')
const { professionCtrl } = require('../controllers')

router.post('/save', adminAuth, professionCtrl.save)
router.get('/get-professions', professionCtrl.getProfessions)
router.get('/filter-professions', adminAuth, professionCtrl.filterProfessions)

module.exports = router