const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connection = require('./db');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    accessType: 'offline', // Ensure to request offline access
    prompt: 'consent', // Ask for consent only once
},
    function (accessToken, refreshToken, profile, done) {
        console.log('accessToken :', accessToken)
        console.log('refreshToken :', refreshToken)
        console.log('profile :', profile)


        const { _json } = profile;

        connection.query('SELECT * FROM nguoi_dung WHERE google_id = ?', [_json.sub], (err, results) => {
            if (err) {
                return done(err);
            }
            if (results.length === 0) {
                const newUser = {
                    google_id: _json.sub,
                    ten_nguoi_dung: _json.name,
                    email: _json.email,
                    anh_dai_dien: _json.picture,
                    phan_quyen: 2,
                    refresh_token: refreshToken,
                    access_token: accessToken,
                };
                connection.query('INSERT INTO nguoi_dung SET ?', newUser, (err, result) => {
                    if (err) {
                        return done(err);
                    }
                    return done(null, newUser);
                });
            } else {
                const existingUser = results[0];
                existingUser.access_token = accessToken;
                existingUser.refresh_token = refreshToken;
                connection.query('UPDATE nguoi_dung SET access_token = ?, refresh_token = ? WHERE google_id = ?',
                    [accessToken, refreshToken, _json.sub], (err, result) => {
                        if (err) {
                            return done(err);
                        }
                        return done(null, existingUser);
                    });
            }
        });


    }
));

passport.serializeUser((user, done) => {
    done(null, user.google_id);
});

passport.deserializeUser((id, done) => {
    connection.query('SELECT * FROM nguoi_dung WHERE google_id = ?', [id], (err, results) => {
        if (err) {
            return done(err);
        }
        return done(null, results[0]);
    });
});

module.exports = passport;
