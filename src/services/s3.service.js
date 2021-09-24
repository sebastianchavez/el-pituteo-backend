const AWS = require('aws-sdk')
const s3Sertive = {}
const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ACL, S3_BUCKET } = process.env

AWS.config.update({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY
})

// TODO: llevar a promesa
s3Sertive.getObject = async obj => {
  try {
    let params = {}
    const s3 = new AWS.S3()
    params.Key = `${obj.path}${obj.image}`
    let response = await s3.listObjects(params)
    return response
  } catch (err) {
    return err
  }
}

s3Sertive.saveImage = (obj) => {
  return new Promise(async (resolve, reject) => {
        try {
            const s3 = new AWS.S3()
            let encodedImage = obj.image
            let decodedImage = Buffer.from(encodedImage, 'base64')
            let params = {
                Bucket: S3_BUCKET,
                Key: `${obj.path}${obj.name}`,
                ACL: S3_ACL,
                Body: decodedImage
            }
            const response = await s3.upload(params).promise()
            resolve(response)
        } catch (e) {
            reject(e)
        }
    })
}

// TODO: llevar a promesa
s3Sertive.deleteImage = (obj, callback) => {
  try {
    const s3 = new AWS.S3()
    let params = {
      Bucket: S3_BUCKET,
      Key: `${obj.path}${obj.name}`
    }
    s3.deleteObject(params).promise().then(res => {
      callback(null, res)
    }).catch(err => {
      callback(err)
    })
  } catch (err) {
    callback(err)
  }
}

module.exports = s3Sertive
