const SiteController = require('../app/controllers/SiteController');
const express = require('express');
const router = express.Router();

router.get('/', SiteController.index);

module.exports = router;
