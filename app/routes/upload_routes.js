const express = require('express')
const Upload = require('../models/upload')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const removeBlanks = require('../../lib/remove_blank_fields')
const router = express.Router()
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const requireOwnership = customErrors.requireOwnership

// Require the multer middle library for handling multi-part requests
const multer = require('multer')

// Configure the upload object telling multer where we want to store the image
// temporarily on the server before sending it to aws.
const upload = multer({ dest: 'uploads/', storage: multer.memoryStorage() })
// Require our promisified s3Upload function.
const promiseS3Upload = require('../../lib/s3UploadApi.js')

// CREATE
// POST /uploads
// In our POST route for /uploads we include the multer middleware.
// The `single` method needs the name attribute from the form's input that has
// a type of file
router.post('/create-uploads', upload.single('image'), requireToken, (req, res, next) => {
  // req.body.upload.owner = req.user.id
  // Invoke our promisified s3Upload function, passing in the req.file which is
  // an object that multer attached to the request object.
  promiseS3Upload(req.file)
    // This .then receives the response from aws if the upload was successful.
    .then(awsResponse => {
      // Create an Upload document with the Location property from aws's
      // response.
      return Upload.create({file: awsResponse.Location, owner: req.user.id})
    })
    // This .then receives the Mongo document from the DB.
    .then(uploads => {
      // Convert the document to json to send back to the client.
      res.status(201).json({ upload: uploads.toObject() })
    })
    .catch(next)
})

// INDEX
// GET /uploads
router.get('/uploads', (req, res, next) => {
  Upload.find()
    .then(uploads => {
      return uploads.map(upload => upload.toObject())
    })
    .then(uploads => {
      res.json({uploads})
    })
    // .then(uploads => {
    //   return uploads.map(upload => upload.toObject())
    // })
    // .then(uploads => res.status(200).json({ uploads: uploads }))
    .catch(next)
})

// SHOW
// GET /uploads/5a7db6c74d55bc51bdf39793
router.get('/uploads/:id', (req, res, next) => {
  Upload.findById(req.params.id)
    .then(handle404)
    .then(upload => res.status(200).json({ upload: upload.toObject() }))
    .catch(next)
})

// UPDATE
// PATCH /uploads/5a7db6c74d55bc51bdf39793
router.patch('/uploads/:id', removeBlanks, requireToken, (req, res, next) => {
  Upload.findById(req.params.id)
    .then(handle404)
    .then(upload => {
      // requireOwnership(req, upload)
      return upload.update(req.body.upload)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
  // delete req.body.Upload.owner
  // promiseS3Upload(req.file)
  //   // This .then receives the response from aws if the upload was successful.
  //   .then(awsResponse => {
  //     Upload.findById(req.params.id)
  //       .then(handle404)
  //       .then(upload => {
  //         // requireOwnership(req, upload)
  //         return upload.update(req.body.file)
  //       })
  //       .then(() => res.sendStatus(204))
  //       .catch(next)
  //     // Create an Upload document with the Location property from aws's
  //     // response.
  //     // Upload.create({file: awsResponse.Location, owner: req.user.id})
  //   })
  // Upload.findById(req.params.id)
  //   .then(handle404)
  //   .then(upload => {
  //     // requireOwnership(req, upload)
  //     return upload.update(req.body.upload)
  //   })
  //   .then(() => res.sendStatus(204))
  //   .catch(next)
  // Upload.findById(req.params.id)
  //   .then(handle404)
  //   .then(upload => {
  //     // requireOwnership(req, upload)
  //     return upload.update(req.body.upload)
  //   })
  //   .then(() => res.sendStatus(204))
  //   .catch(next)
})

// DESTROY
// DELETE /uploads/5a7db6c74d55bc51bdf39793
router.delete('/uploads/:id', requireToken, (req, res, next) => {
  Upload.findById(req.params.id)
    .then(handle404)
    .then(upload => {
      upload.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
