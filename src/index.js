const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;


const route = require('./routes');
// get the client
const connection = require('./config/db/index')

connection.query(
    // 'SELECT * FROM `khu_vuc` ',
    // function (err, results, fields) {
    //     console.log(results); // results contains rows returned by server
    //     console.log(fields); // fields contains extra meta data about results, if available
    // }
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
