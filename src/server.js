const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const routes = require('./routes');
const passport = require('passport');
const Handlebars = require('handlebars');
const connection = require('./config/db');
const cookieParser = require('cookie-parser');

require('dotenv').config();
require('./config/passport');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware setup
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    }),
);

app.use(cookieParser());

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

// HTTP logger
app.use(morgan('combined'));
app.use(methodOverride('_method'));

//template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'resources/views/layouts'),
        partialsDir: path.join(__dirname, 'resources/views/partials'),
        helpers: {
            sum: (index, currentPage) => {
                currentPage = Number(currentPage);
                return (currentPage - 1) * 10 + index + 1;
            },
            renderStars: function (diem_danh_gia) {
                let stars = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= diem_danh_gia) {
                        stars += '<i class="fa-solid fa-star"></i>';
                    } else {
                        stars += '<i class="fa-regular fa-star"></i>';
                    }
                }
                return new Handlebars.SafeString(stars);
            },
            eq: function (v1, v2) {
                return v1 === v2;
            },
            json: function(context) {
                return JSON.stringify(context);
            }
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

routes(app, io);
const ChatController = require('./app/controllers/ChatController');

io.on('connection', (socket) => {
    socket.on('disconnect', () => { });

    socket.on('sendMessage', (formData) => {
        console.log('Received message:', formData);
        ChatController.sendMessage(
            { body: formData },
            {
                status: (status) => {
                    return { json: console.log };
                },
            },
            null,
            io,
        );
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
