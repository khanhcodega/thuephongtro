const RentalController = require('../app/controllers/RentalController')
const express = require('express')
const router = express.Router()

router.get('/',RentalController.index)

module.exports = router