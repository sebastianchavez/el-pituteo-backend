//archivo index.js
var express = require('express');
var fs = require('fs');
var https = require('https');
var app = express(); const

PUERTO = 443;

https.createServer({
   cert: fs.readFileSync('cert.pem'),
   key: fs.readFileSync('key.pem')
 },app).listen(PUERTO, function(){
	console.log('Servidor https correindo en el puerto 443');
});

app.get('/', function(req, res){
         res.send('Hola, estas en la pagina inicial');
         console.log('Se recibio una petición get a través de https');
});
