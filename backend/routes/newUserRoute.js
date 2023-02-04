const express = require('express')
const router = express.Router()
const newUserController = require('../controllers/newUserController')

router.route('/')
    .post( newUserController.createNewUser)

module.exports = router