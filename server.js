// DEPENDENCIES
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
// const moment = require("moment");
// const path = require("path");
const db = require('./models');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoscraper';


// DATABASE

// Connect to the Mongo DB
mongoose.set('useFindAndModify', false);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected");
    })
    .catch(err => {
        console.log("Database connection error" + err);
    })

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

// CONTROLLERS
const router = require("./controllers/api.js");
app.use(router);

// DEFINE OUR ROUTES
app.use(require('./routes/apiRoutes')(app, db));
app.use(require('./routes/htmlRoutes')(app, db));


// // GET ROUTE for getting the scraped articles from the DB
// app.get("/articles", function(req, res) {

//   // Grab all of the articles in the collection
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If the articles were found, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });

// // GET ROUTE for specific articles by ID, then populating the entry with it's corresponding note
// app.get("/articles/:id", function(req, res) {

//   // Using the ID in the request param, query the DB for the matching article
//   db.Article.findById(req.params.id)
//     // Populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we found the article with the given ID, send it back
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });

// // POST ROUTE for saving/updating an article's associated note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the request body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If the note was created, find the article with ID in the request body, and update that article to be associated with that new note
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true});
//     })
//     .then(function(dbArticle) {
//       // If article successfully updated, send back to client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });





// TEST FOR AXIOS
// axios.get("https://www.nytimes.com/").then(function (response) {
  
//   var $ = cheerio.load(response.data);

//   // console.log($);

//   var links = [];
//   var titles = [];
//   var summaries = [];

//   var listItems = $("article").each((i, element) => {
//     links.push("https://nytimes.com" + $(element).find("a").attr("href"));
//     titles.push($(element).find("h2").text());
//     summaries.push($(element).find("p").text());
//   });

//   // console.log(listItems);
//   console.log(links);
//   console.log(titles);
//   console.log(summaries);
// });

// LISTEN ==============================================================
app.listen(PORT, function() {
    console.log(`App running at http://localhost:${PORT}`);
});

module.exports = app;