const TestController = require('../app/controllers/TestController');
const express = require('express');
const router = express.Router();
const upload = require('../app/middlewares/upload'); // Đường dẫn tới file cấu hình Multer

router.post('/set-ma-so', TestController.setMaSo);
router.put('/update-user', upload.single('avatar'), TestController.update);

router.get('/', TestController.index);

module.exports = router;
