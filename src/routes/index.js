const site = require('./site');
const rental = require('./rental');
const chat = require('./chat');
const user = require('./user');
const postNews = require('./postNews');
const partials = require('./partials');
const admin = require('./admin');
const authGoogle = require('./authGoogle');
const mapboxRoute = require('./map');
function route(app, io) {
    app.use('/admin', admin);

    app.use('/api/auth', authGoogle);
    app.use('/chat', chat(io));
    app.use('/nha-cho-thue', rental);
    app.use('/quan-ly', user);
    app.use('/dang-tin', postNews);
    app.use('/api/map', mapboxRoute);
    app.use('/', partials);
    app.use('/', site);
}
module.exports = route;
