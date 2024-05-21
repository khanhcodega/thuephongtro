const TestController = require('../app/controllers/TestController');
const express = require('express');
const router = express.Router();

router.get('/', TestController.index);

module.exports = router;
