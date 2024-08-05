const RentalController = require('../app/controllers/RentalController');
const express = require('express');
const router = express.Router();

router.post('/api/toggle-like', RentalController.toggleLike);
router.post('/api/history-news', RentalController.historyNews);
router.get('/map', RentalController.getMap);
router.get('/:id', RentalController.show);
router.get('/', RentalController.index);

module.exports = router;
