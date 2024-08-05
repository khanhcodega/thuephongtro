const express = require('express');
const router = express.Router();
const mapboxController = require('../app/controllers/MapController');

router.get('/location', mapboxController.getLocation);
router.get('/universities', mapboxController.getUniversities);

module.exports = router;
