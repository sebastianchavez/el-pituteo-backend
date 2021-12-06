require('dotenv').config()
const app = require('./app')
require('./config/db')
var fs = require('fs');
var https = require('https');
const { PORT } = require('./config/server')


const main = async () => {
  https.createServer({
    cert: fs.readFileSync('mi_certificado.crt'),
    key: fs.readFileSync('mi_certificado.key')
  }, app).listen(PORT, function () {
    console.log('Servidor https correindo en el puerto 443');
  });

  // await app.listen(app.get('port'))
  // console.log(`Server on port ${app.get('port')}`)
}

main()