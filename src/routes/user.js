const UserController = require('../app/controllers/UserController');
const express = require('express');
const router = express.Router();
const upload = require('../app/middlewares/upload');
const middlewareCheckLogin = require('../app/middlewares/client');

router.use(middlewareCheckLogin.ensureAuthenticated);
router.put('/update-user', upload.single('avatar'), UserController.update);
router.put(
    '/quan-ly-tin/:id/edit',
    upload.fields([
        { name: 'images', maxCount: 12 },
        { name: 'video', maxCount: 1 },
    ]),
    UserController.updateNews,
);
router.get('/quan-ly-tin/:id', UserController.getInfoNews);
router.delete('/quan-ly-tin/:id/delete', UserController.deleteNews);
router.get('/quan-ly-tin', UserController.storeNews);
router.get('/lich-su-xem-tin', UserController.historyNews);
router.get('/tin-da-luu', UserController.saveNews);
router.get('/quan-ly-tai-khoan', UserController.index);

module.exports = router;
