// DEPENDENCIES
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const db = require('./models');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoscraper';

// DATABASE

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log("Database connected");
    })
    .catch(err => {
        console.log("Database connection error" + err);
    });

// EXPRESS & PORT
const app = express();
const router = express.Router();

// DEFINE OUR ROUTES
require('./routes/htmlRoutes')(router);
app.use(router);

const PORT = process.env.PORT || 3000;

// CONFIGURE MIDDLEWARE

// Morgan for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Make "public" a static folder
app.use(express.static('public'));

// HANDLEBARS
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


// app.use(require('./routes/apiRoutes')(app, db));
// app.use(require('./routes/htmlRoutes')(app, db));

// LISTEN ==============================================================
app.listen(PORT, function() {
    console.log(`App running at http://localhost:${PORT}`);
});

module.exports = app;