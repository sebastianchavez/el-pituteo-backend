  
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./server')


mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const connection = mongoose.connection

connection.once('open', () => {
  console.log('DB is connected')
})