const UserController = require('../app/controllers/UserController');
const express = require('express');
const router = express.Router();
const upload = require('../app/middlewares/upload'); // Đường dẫn tới file cấu hình Multer

router.post('/set-ma-so', UserController.setMaSo);
router.put('/update-user', upload.single('avatar'), UserController.update);
router.get('/', UserController.index);

module.exports = router;
