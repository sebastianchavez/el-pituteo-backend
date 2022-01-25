require('dotenv').config()
const app = require('./app')
require('./config/db')

const main = async () => {
  try {
    await app.listen(app.get('port'))
    console.log(`Server on port ${app.get('port')}`)
  } catch (error) {
    console.log('Error al levantar servidor:', error)
  }
}

main()