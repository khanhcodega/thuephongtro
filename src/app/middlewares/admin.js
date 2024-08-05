module.exports = {
    isAuthenticated: function (req, res, next) {
        if (req.session.admin) {
            return next();
        } else {
            res.redirect('/admin/login');
        }
    },
};
