const express = require('express')
const router = express.Router()
const { professionCtrl } = require('../controllers')

router.post('/save', professionCtrl.save)
router.get('/get-professions', professionCtrl.getProfessions)

module.exports = router