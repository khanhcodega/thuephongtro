class TestController {
    index(req, res, next) {
        res.render('register');
    }
}

module.exports = new TestController();
