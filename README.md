# El Pituteo Backend

Proyecto Backend con NodeJS para Instituto CIISA el cual contiene la l贸gica de negocio, notificaciones push, conexi贸n con AWS, MongoDB

## Comenzando 馃殌

+ [Descargar desde github](https://github.com/sebastianchavez/el-pituteo-backend.git) 


### Pre-requisitos 馃搵
Es necesario tener instalado NodeJs desde la versi贸n 10
En lo posible 煤ltima versi贸n de NodeJs: https://nodejs.org/es/

Para despliegue de aplicaci贸n es necesario contar con PM2: https://pm2.keymetrics.io/

```
npm install pm2 -g
```

### Instalaci贸n 馃敡

Una vez instalado NodeJs ejecutar comando
```
npm install
```

## Despliegue 馃摝

Para despliegue de la aplicaci贸n para conceptos de pruebas o desarrollo ejecutar comandos
```
npm run dev
```
贸
```
npm start
```

Para producci贸n ejecutar
```
pm2 start index.js
```

Tambi茅n es necesario contar con variables de entornos:
```
MONGODB_URI
PORT
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_ACL
S3_BUCKET
SECRET_TOKEN
EMAIL_USER
EMAIL_PASSWORD
ONESIGNAL_URL
ONESIGNAL_APP_ID
ONESIGNAL_APIRESP
STRIPE_SK
STRIPE_CURRENCY
HTTPS_CERT
HTTPS_KEY
```


## Construido con 馃洜锔?

* [Express](https://expressjs.com/es/) - Framework para construcci贸n de API's
* [Mongoose](https://mongoosejs.com/) - ORM

## Versionado 馃搶

Usamos [GIT](https://git-scm.com/) para el versionado. [repositorio](https://github.com/sebastianchavez/el-pituteo-backend).


## Desarrolladores 鉁掞笍

* **Sebasti谩n Chavez** - [sebastianchavez](https://github.com/sebastianchavez)

## Licencia 馃搫

Este proyecto est谩 bajo la Licencia (ISC)