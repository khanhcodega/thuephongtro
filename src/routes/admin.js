const AdminController = require('../app/controllers/AdminController');
const express = require('express');
const router = express.Router();
const middlewareAdmin = require('../app/middlewares/admin');
const upload = require('../app/middlewares/upload');

router.get('/', AdminController.index);
router.get('/login', AdminController.index);
router.post('/api/login', AdminController.login);
router.use(middlewareAdmin.isAuthenticated);

//news
router.get('/dashboard', AdminController.dashboard);
router.get('/quan-ly-tin', AdminController.storeNews);
router.get('/quan-ly-tin/:id', AdminController.previewNews);
router.delete('/quan-ly-tin/:id/delete', AdminController.deleteNews);
router.put('/quan-ly-tin/:id/update', AdminController.approvedNews);

//users
router.get('/quan-ly-nguoi_dung', AdminController.storeUsers);
router.get('/quan-ly-nguoi_dung/:id', AdminController.previewUser);
router.delete('/quan-ly-nguoi_dung/:id/delete', AdminController.deleteUser);

//area -cities
router.get('/quan-ly-khu-vuc/thanh-pho', AdminController.storeCities);
router.delete(
    '/quan-ly-khu-vuc/thanh-pho/:id/delete',
    AdminController.deleteCity,
);
router.put(
    '/quan-ly-khu-vuc/thanh-pho/update',
    upload.none(),
    AdminController.updateCity,
);
router.post('/quan-ly-khu-vuc/get-city/:id', AdminController.getCity);
router.post(
    '/quan-ly-khu-vuc/thanh-pho/add-city',
    upload.none(),
    AdminController.addCity,
);

//area -districts
router.get('/quan-ly-khu-vuc/quan-huyen', AdminController.storeDistricts);
router.post('/quan-ly-khu-vuc/get-district/:id', AdminController.getDistrict);
router.post(
    '/quan-ly-khu-vuc/quan-huyen/add-district',
    upload.none(),
    AdminController.addDistrict,
);
router.delete(
    '/quan-ly-khu-vuc/quan-huyen/:id/delete',
    AdminController.deleteDistrict,
);
router.put(
    '/quan-ly-khu-vuc/quan-huyen/update',
    upload.none(),
    AdminController.updateDistrict,
);

//area -wards
router.get('/quan-ly-khu-vuc/phuong-xa', AdminController.storeWards);
router.post('/quan-ly-khu-vuc/get-ward/:id', AdminController.getWard);
router.post(
    '/quan-ly-khu-vuc/phuong-xa/add-ward',
    upload.none(),
    AdminController.addWard,
);
router.delete(
    '/quan-ly-khu-vuc/phuong-xa/:id/delete',
    AdminController.deleteWard,
);
router.put(
    '/quan-ly-khu-vuc/phuong-xa/update',
    upload.none(),
    AdminController.updateWard,
);

//category
router.get('/quan-ly-danh-muc', AdminController.storeCategories);
router.post(
    '/quan-ly-danh-muc/add',
    upload.none(),
    AdminController.addCategory,
);
router.post('/quan-ly-danh-muc/:id', AdminController.getCategory);
router.delete('/quan-ly-danh-muc/:id/delete', AdminController.deleteCategory);
router.put(
    '/quan-ly-danh-muc/update',
    upload.none(),
    AdminController.updateCategory,
);

module.exports = router;
