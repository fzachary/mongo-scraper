// DEPENDENCIES
const express = require('express');
const logger = require('morgan'); 
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const db = require('./models');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://<dbuser>:<dbpassword>@ds141178.mlab.com:41178/heroku_04p91zg0';

// DATABASE
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(function() {
        console.log("Database connected");
    })
    .catch(function(err) {
        console.log("Database connection error" + err);
    });

// EXPRESS & PORT
const app = express();
const PORT = process.env.PORT || 3000;

// CONFIGURE MIDDLEWARES
// Morgan for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make "public" a static folder
app.use(express.static('public'));

// HANDLEBARS
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// DEFINE OUR ROUTES
app.use(require('./routes/apiRoutes')(db));
app.use(require('./routes/htmlRoutes')(db));

// LISTEN ==============================================================
app.listen(PORT, function() {
    console.log(`App running at http://localhost:${PORT}`);
});
