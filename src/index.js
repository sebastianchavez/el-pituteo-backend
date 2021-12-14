require('dotenv').config()
const app = require('./app')
require('./config/db')
var fs = require('fs');
var https = require('https');
const { PORT } = require('./config/server')
const { AVAILABLE_SSL, HTTPS_CERT, HTTPS_KEY } = process.env

const main = async () => {
  try {
    if (AVAILABLE_SSL) {
      https.createServer({
        cert: fs.readFileSync(HTTPS_CERT),
        key: fs.readFileSync(HTTPS_KEY)
      }, app).listen(PORT, function () {
        console.log(`Server on port ${PORT} - HTTPS`)
      });
    } else {
      await app.listen(app.get('port'))
      console.log(`Server on port ${app.get('port')}`)
    }
  } catch (error) {
    console.log('Error al levantar servidor:', error)
  }
}

main()