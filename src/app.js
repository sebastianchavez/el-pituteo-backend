const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const { PORT } = require('./config/server')
const routers = require('./routers')
// settings
app.set('port', PORT)

// middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' })) // TODO: definir limite transferencia

// routes
app.use('/api/admins', routers.adminRouter)
app.use('/api/categories', routers.categoryRouter)
app.use('/api/communes', routers.communeRouter)
app.use('/api/users', routers.userRouter)
app.use('/api/paymentmethods', routers.paymentMethodRouter)
app.use('/api/professions', routers.professionRouter)

module.exports = app