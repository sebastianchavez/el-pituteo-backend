const express = require('express')
const router = express.Router()
const { employerAuth, adminAuth, userAuth, employeeAuth } = require('../middlewares')
const { workCtrl } = require('../controllers')

router.post('/publish', employerAuth, workCtrl.publish)
router.put('/update-image', employerAuth, workCtrl.updateImage)
router.get('/filter', userAuth, workCtrl.filter)
router.put('/update-state', adminAuth, workCtrl.updateState)
router.put('/apply-work', employeeAuth, workCtrl.applyWork)
router.get('/get-work', userAuth, workCtrl.getWorkById)
router.put('/accept-applicant', userAuth, workCtrl.acceptApplicant)
router.get('/get-my-works', userAuth, workCtrl.getMyWorks)
router.put('/cancel', employerAuth, workCtrl.cancel)
router.put('/complete', employerAuth, workCtrl.complete)

module.exports = router