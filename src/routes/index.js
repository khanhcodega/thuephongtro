const site = require('./site');
const rental = require('./rental')
const test = require('./test')
const partials = require('./partials')


function route(app) {
    app.use('/rental', rental)
    app.use('/test', test)
    app.use('/', site);
    app.use('/', partials);
}
module.exports = route;
