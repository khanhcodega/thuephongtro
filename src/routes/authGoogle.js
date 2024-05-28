const express = require('express');
const router = express.Router();
const passport = require('passport');
const { json } = require('sequelize');

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login' }),
  (req, res) => {
    // Redirect to the original URL or to '/' if not available
    const user = req.user
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);

  }
);

router.get('/error', (req, res) => res.send("error logging in"));
router.get('/login', (req, res) => {
  res.send('Login failed. Please try again.');
});
module.exports = router;
