const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const { PORT } = require('./config/server')
const routers = require('./routers')
const { AVAILABLE_SSL } = process.env
const expressip = require('express-ip');

// settings
if (!AVAILABLE_SSL) {
    app.set('port', PORT)
}
// middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' })) // TODO: definir limite transferencia
app.use(expressip().getIpInfoMiddleware);

// routes
app.use((req, res, next) => {
    console.log('IP:', req.ipInfo)
    next()
})
app.use('/api/admins', routers.adminRouter)
app.use('/api/categories', routers.categoryRouter)
app.use('/api/communes', routers.communeRouter)
app.use('/api/users', routers.userRouter)
app.use('/api/payment-methods', routers.paymentMethodRouter)
app.use('/api/professions', routers.professionRouter)
app.use('/api/works', routers.workRouter)
app.use('/api/notifications', routers.notificationRouter)

module.exports = app