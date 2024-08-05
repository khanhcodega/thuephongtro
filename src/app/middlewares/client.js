module.exports = {
    ensureAuthenticated: function (req, res, next) {
        const userCookie = req.cookies.user;
        if (userCookie) {
            const user = JSON.parse(userCookie);
            req.user = user;
            return next();
        }
        res.redirect('/');
    },

    forwardAuthenticated: function (req, res, next) {
        const userCookie = req.cookies.user;
        if (!userCookie) {
            return next();
        }
        res.redirect('/');
    },
};
