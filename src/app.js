const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const { PORT } = require('./config/server')

// settings
app.set('port', PORT)

// middlewares
app.use(cors())
app.use(morgan('dev'))
// app.use(express.json({ limit: '50mb' })) // definir limite transferencia

// routes

module.exports = app