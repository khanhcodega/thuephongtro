const SiteController = require('../app/controllers/SiteController');
const express = require('express');
const router = express.Router();

router.post('/set-ma-so', SiteController.setMaSo);
router.get('/home', SiteController.index);

router.get('/', SiteController.index);

module.exports = router;
