const mongoose = require('mongoose')
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SK)
const { Work, User } = require('../models')
const { s3Service, oneSignalService, stripeService } = require('../services')
const { STATES } = require('../config/constants')
const emailService = require('../services/email.service')
const workCtrl = {}

workCtrl.publish = async (req, res) => {
    try {
        const { title, description, amount, paymentmethod, image, imageName, commune, direction, category } = req.body
        const { userId } = req.user
        const dataToSave = {
            title,
            description,
            amount,
            paymentMethodId: mongoose.Types.ObjectId(paymentmethod),
            image,
            imageName,
            categoryId: mongoose.Types.ObjectId(category),
            address: {
                address: direction,
                communeId: mongoose.Types.ObjectId(commune),
            },
            userIdEmployer: mongoose.Types.ObjectId(userId),
            state: STATES.WORK.PENDING
        }
        const newWork = new Work(dataToSave)
        await newWork.save()
        res.status(200).send({ message: 'Success', work: newWork })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.updateImage = async (req, res) => {
    try {
        const { image, nameImage } = req.body
        const { idS3 } = req.user

        const obj = {
            image,
            name: nameImage,
            path: `${idS3}/works/`,
        }
        const response = await s3Service.saveImage(obj)
        res.status(200).send({ message: 'Success', url: response.Location })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.filter = async (req, res) => {
    try {
        const { title, states, category, commune, startDate, endDate, page, limit, paymentMethodId, isDeposited } = req.query
        let criteria = {}
        criteria.$and = []
        criteria.$or = []
        if (title && title != '') {
            let regex = new RegExp('^' + title.toLowerCase(), 'i')
            let option = { $regex: regex }
            criteria.$and.push({ title: option })
        }
        if (states && states != '') {
            criteria.state = { $in: states.split(',') }
        }
        if (category && category != '') {
            criteria.categoryId = { $in: category.split(',') }
        }
        if (commune && commune != '') {
            criteria['address.communeId'] = { $in: commune.split(',') }
        }
        if (paymentMethodId && paymentMethodId != '') {
            criteria.paymentMethodId = { $in: paymentMethodId.split(',') }
        }
        if (isDeposited && isDeposited != '') {
            if (isDeposited.split(',').find(x => x == 'false') && isDeposited.split(',').find(x => x == 'true')) {
                criteria.$or = [{ isDeposited: { $exists: false } }, { isDeposited: false }, { isDeposited: true }]
            } else if (isDeposited.split(',').find(x => x == 'false')) {
                criteria.$or = [{ isDeposited: { $exists: false } }, { isDeposited: false }]
            } else {
                criteria.isDeposited = true
            }
        }
        if (startDate && startDate != '' && endDate && endDate != '') {
            let end = new Date(endDate)
            let start = new Date(startDate)
            end.setHours(23)
            end.setMinutes(59)
            end.setSeconds(59)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(1)
            criteria.createdAt = { $gte: start, $lte: end }
        }
        if (criteria.$and.length == 0) {
            delete criteria.$and
        }
        if (criteria.$or.length == 0) {
            delete criteria.$or
        }

        const populate = [
            { select: 'name code', path: 'paymentMethodId' },
            { select: 'name icon image', path: 'categoryId' },
            { select: 'name region', path: 'address.communeId' },
            { select: 'email accountBank', path: 'userIdEmployee' },
            { select: 'email', path: 'userIdEmployer' }
        ]
        let works
        console.log('criteria:', criteria)
        if (limit && parseFloat(limit) > 0) {
            works = await Work.find(criteria).skip((parseFloat(page) * parseFloat(limit)) - parseFloat(limit)).populate(populate).sort({ createdAt: -1 }).limit(parseFloat(limit))
        } else {
            works = await Work.find(criteria).populate(populate).sort({ createdAt: -1 })
        }

        res.status(200).send({ message: 'Success', works })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.updateState = async (req, res) => {
    try {
        const { _id, accept, resolution } = req.body
        const state = accept ? STATES.WORK.AVAILABLE : STATES.WORK.REJECTED
        const work = await Work.findByIdAndUpdate(_id, { $set: { state, resolution } })
        const user = await User.findById(work.userIdEmployer)
        await oneSignalService.sendPushResolutionWork(user.pushId, state)
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.applyWork = async (req, res) => {
    try {
        const { userId } = req.user
        const { _id, userIdEmployer } = req.body
        if (userId == userIdEmployer._id) {
            res.status(400).send({ message: 'No puede postular a su propia publicación' })
        } else {
            const work = await Work.findById(_id)
            let flag = work.applicants.find(x => x.userId == userId)
            if (flag) {
                res.status(400).send({ message: 'Ya postulaste a este pituto' })
            } else {
                const applicant = {
                    userId: mongoose.Types.ObjectId(userId),
                    applicantedDate: new Date(),
                }
                const user = await User.findById(userIdEmployer)
                await Work.findByIdAndUpdate(_id, { $addToSet: { applicants: applicant } })
                await oneSignalService.sendPushApplyWork(user.pushId, _id)
                res.status(200).send({ message: 'Postulación realizada con éxito' })
            }
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.getWorkById = async (req, res) => {
    try {
        const { id } = req.query
        const populate = [
            { select: 'email names files', path: 'applicants.userId' },
            { select: 'email names files', path: 'userIdEmployee' },
            { select: 'email names files', path: 'userIdEmployer' },
        ]
        const work = await Work.findById(id).populate(populate)
        res.status(200).send({ message: 'Success', work })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.acceptApplicant = async (req, res) => {
    try {
        const { _id, workId } = req.body
        await Work.findByIdAndUpdate(workId, { $set: { state: STATES.WORK.IN_PROGRESS, userIdEmployee: mongoose.Types.ObjectId(_id) } })
        res.status(200).send({ message: 'Apitutado aceptado con éxito' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.getMyWorks = async (req, res) => {
    try {
        const { userId } = req.user
        const populate = [
            { select: 'name code', path: 'paymentMethodId' },
            { select: 'name icon image', path: 'categoryId' },
            { select: 'name region', path: 'address.communeId' },
            { select: 'email rut pushId', path: 'userIdEmployer' },
            { select: 'email rut pushId', path: 'userIdEmployee' }
        ]

        const works = await Work.find({ $or: [{ userIdEmployer: userId }, { userIdEmployee: userId }] }).sort({ createdAt: -1 }).populate(populate)
        res.status(200).send({ message: 'Success', works })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.complete = async (req, res) => {
    try {
        const { _id, paymentMethodId, userIdEmployee } = req.body
        console.log({ paymentMethodId, userIdEmployee })
        await Work.findByIdAndUpdate(_id, { $set: { state: STATES.WORK.COMPLETED, finishDate: new Date() } })
        if (paymentMethodId.code == 'STRIPE') {
            oneSignalService.sendPushPaymentStripe(userIdEmployee.pushId)
                .catch(error => {
                    console.log('Error oneSignalService -', error)
                })
            emailService.sendEmailPaymentStripe(userIdEmployee)
                .catch(error => {
                    console.log('Error emailService -', error)
                })
        } else {
            oneSignalService.sendPushPaymentMoney(userIdEmployee.pushId)
                .catch(error => {
                    console.log('Error oneSignal', error)
                })
            emailService.sendEmailPaymentMoney(userIdEmployee)
                .catch(error => {
                    console.log('Error emailService -', error)
                })
        }
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.cancel = async (req, res) => {
    try {
        const { _id } = req.body
        await Work.findByIdAndUpdate(_id, { $set: { state: STATES.WORK.CANCELED } })
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.rating = async (req, res) => {
    try {
        const { _id, rating, comentary } = req.body
        let userId
        const work = await Work.findById(_id)
        if (work) {
            if (work.userIdEmployer == req.user.userId) {
                if (work.ratingEmployee && work.ratingEmployee.rating > 0) {
                    res.status(400).send({ message: 'Este pituto ya se encuentra evaluado' })
                    return
                }
                await Work.findByIdAndUpdate(_id, { $set: { ratingEmployee: { rating, comentary } } })
                userId = work.userIdEmployee
            } else {
                if (work.ratingEmployer && work.ratingEmployer.rating > 0) {
                    res.status(400).send({ message: 'Este pituto ya se encuentra evaluado' })
                    return
                }
                await Work.findByIdAndUpdate(_id, { $set: { ratingEmployer: { rating, comentary } } })
                userId = work.userIdEmployer
            }
            const user = await User.findById(userId)
            if (user) {
                const { numberOfPeopleRated, totalRating } = user.rating
                let newNumberOfPeopleRated = numberOfPeopleRated + 1
                let newTotalRating = totalRating + rating
                let newRating = newTotalRating / newNumberOfPeopleRated
                await User.findByIdAndUpdate(userId, { $set: { rating: { rating: newRating, numberOfPeopleRated: newNumberOfPeopleRated, totalRating: newTotalRating } } })
            }
        }
        res.status(200).send({ message: 'Success' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.confirmPymentStripe = async (req, res) => {
    try {

        const { token, amount, userIdEmployee, _id } = req.body
        let responsePaymentIntent

        const work = await Work.findById(_id)

        if (work && work.paymentState && work.paymentState == STATES.PAYMENT.SUCCESS_STRIPE_PAYMENT_CONFIRM) {
            res.status(200).send({ message: 'Pituto ya se encuentra pagado' })
            return
        }

        const responseMethod = await stripeService.generatePaymentMethod(token.id)
        if (work && (!work.paymentState || work.paymentState == '' || work.paymentState == STATES.PAYMENT.FAILED_STRIPE_PAYMENT_INTENT)) {
            try {
                responsePaymentIntent = await stripeService.generatePaymentIntent(
                    {
                        amount: amount,
                        user: userIdEmployee,
                        payment_method: responseMethod.id
                    }
                )

                await Work.findByIdAndUpdate(_id, { $set: { stripeId: responsePaymentIntent.id, paymentState: STATES.PAYMENT.SUCCESS_STRIPE_PAYMENT_INTENT } })
            } catch (error) {
                console.log('Error en intento de pago - ', error)
                await Work.findByIdAndUpdate(_id, { $set: { paymentState: STATES.PAYMENT.FAILED_STRIPE_PAYMENT_INTENT } })
                res.status(400).send({ message: 'Problemas al intentar pago con stripe' })
                return
            }
        }

        if (work && (!work.paymentState || work.paymentState == '' || work.paymentState == STATES.PAYMENT.FAILED_STRIPE_PAYMENT_INTENT || work.paymentState == STATES.PAYMENT.FAILED_STRIPE_PAYMENT_CONFIRM || work.paymentState == STATES.PAYMENT.SUCCESS_STRIPE_PAYMENT_INTENT)) {
            try {
                const stripeId = responsePaymentIntent && responsePaymentIntent.id ? responsePaymentIntent.id : work.stripeId
                await stripeService.confirmPaymentIntent(stripeId, responseMethod.id)
                await Work.findByIdAndUpdate(_id, { $set: { paymentState: STATES.PAYMENT.SUCCESS_STRIPE_PAYMENT_CONFIRM } })
            } catch (error) {
                console.log('Error en confirmación de pago - ', error)
                await Work.findByIdAndUpdate(_id, { $set: { paymentState: STATES.PAYMENT.FAILED_STRIPE_PAYMENT_CONFIRM } })
                res.status(400).send({ message: 'Problemas al confirmar pago con stripe' })
                return
            }
        }
        res.status(200).send({ message: 'Pago con stripe exitoso' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}

workCtrl.confirmDeposite = async (req, res) => {
    try {
        const { _id } = req.body
        await Work.findByIdAndUpdate(_id, { $set: { isDeposited: true, depositDate: new Date() } })
        res.status(200).status(200).send({ message: 'Deposito confirmado' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'Error', error: e })
    }
}


module.exports = workCtrl