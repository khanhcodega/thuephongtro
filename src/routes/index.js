const site = require('./site');
const rental = require('./rental')
const test = require('./test')
const user = require('./user')

const partials = require('./partials')
const authGoogle = require('./authGoogle')


function route(app) {
    app.use('/api/auth', authGoogle);
    app.use('/test', test)
    app.use('/rental', rental)
    app.use('/quan-ly', user)
    app.use('/', site);
    app.use('/', partials);
    
}
module.exports = route;
