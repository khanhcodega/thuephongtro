const express = require('express');
const router = express.Router();
const passport = require('passport');
const { json } = require('sequelize');

// Google OAuth login route
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/login' }),
    (req, res) => {
        const data = req.user;
        const timeSave = 15 * 24 * 60 * 60 * 1000;
        res.cookie('user', data.ma_so, { maxAge: timeSave, httpOnly: true });
        res.redirect('/');
    },
);

router.get('/error', (req, res) => res.send('error logging in'));

router.get('/login', (req, res) => {
    res.redirect('/');
});
module.exports = router;
