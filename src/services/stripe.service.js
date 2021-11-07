const Stripe = require('stripe')
const { STRIPE_SK, STRIPE_CURRENCY } = process.env
const stripe = Stripe(STRIPE_SK)
const stripeService = {}

stripeService.generatePaymentIntent = async ({ amount, user, payment_method }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const resPaymentIntent = await stripe.paymentIntents.create({
                amount: parseFloat(amount), // * 100 DLL
                currency: STRIPE_CURRENCY,
                payment_method_types: ['card'],
                payment_method,
                description: `Pago realizado por usuario:"${user.email}", RUT: ${user.rut} `
            });
            resolve(resPaymentIntent)
        } catch (e) {
            reject(e)
        }
    })

}


stripeService.generatePaymentMethod = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: { token }
            });

            resolve(paymentMethod)
        } catch (e) {
            reject(e)
        }
    })
}

stripeService.getPaymentDetail = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailOrder = await stripe.paymentIntents.retrieve(id)
            resolve(detailOrder)
        } catch (e) {
            reject(e)
        }
    })
}

stripeService.confirmPaymentIntent = async (id, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentIntent = await stripe.paymentIntents.confirm(
                id,
                { payment_method: token }
            );
            resolve(paymentIntent)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = stripeService