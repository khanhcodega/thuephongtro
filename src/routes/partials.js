const PartialsController = require('../app/controllers/PartialsControler');
const express = require('express');
const router = express.Router();

router.get('/modal-login', PartialsController.index);
router.get('/modal-regis', PartialsController.showModalRegis);
router.post('/save-info-user', PartialsController.saveInfo);

router.get('/logout', PartialsController.logout);

router.post('/user-login', PartialsController.login);
router.post('/user-regis', PartialsController.regis);
router.get('/api/read-file/list-bad-word', PartialsController.listBadWord);

module.exports = router;
