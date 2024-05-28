const PartialsController = require('../app/controllers/PartialsControler')
const express = require('express')
const router = express.Router()
router.get('/profile', PartialsController.profile)

router.get('/modal-content', PartialsController.index)
router.post('/user-login', PartialsController.login)
router.post('/user-regis', PartialsController.regis)

module.exports = router