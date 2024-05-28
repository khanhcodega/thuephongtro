const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const route = require('./routes');
const passport = require('passport');
require('dotenv').config();
require('./config/passport')



// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
// Đăng ký helper Handlebars
// Handlebars.registerHelper('eq', function (a, b) {
//     return a === b;
// });
// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {

    if (!req.isAuthenticated() && req.originalUrl !== '/api/auth/google' && req.originalUrl !== '/api/auth/google/callback') {
        req.session.returnTo = req.originalUrl;
    }
    next();
});
// Middleware để thêm thông tin đăng nhập vào res.locals
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.ma_so;
    res.locals.user = req.session.ma_so;
    next();
});



// HTTP logger
app.use(morgan('combined'));
app.use(methodOverride('_method'));

//template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: {},
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources//views'));

route(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
