// DEPENDENCIES
const express = require("express");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

// DATABASE/MONGOOSE
// Require the model for accessing the "article" collection
const db = require("./models");
mongoose.connect("mongodb://localhost/mongo-scraper", { useNewUrlParser: true });

// EXPRESS & PORT
const app = express();
const PORT = process.env.PORT || 3000;

// CONFIGURE MIDDLEWARES
// Morgan for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make "public" a static folder
app.use(express.static("public"));

// HANDLEBARS
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ROUTES

// GET ROUTE for scraping articles
app.get("/scrape", function (req, res) {

  // Grab the html with axios
  axios.get("https://www.nytimes.com/")
  .then(function(response) {

    // Load the data into cheerio and save it as "$" for an easy selector
    var $ = cheerio.load(response.data);

    // Grab every h2 within an article tag
    $("article h2").each(function (i, element) {

      // Save into a results object
      var results = {};

      // Add the href of every link
      results.title = $(this)
      .text();
      results.link = $(this)
      .children("a")
      .attr("href");

      // Create a new Article using the "result" object built from scraping
      db.Article.create(result)
      .then(function(dbArticle) {

        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {

        // Log an error if occurred
        console.log(err)
      });
    });

    // Send a message notifying completion of the scrape
    res.send("Scrape Complete");
  });
});



// TEST FOR AXIOS
axios.get("https://www.nytimes.com/").then(function (response) {
  
  var $ = cheerio.load(response.data);

  // console.log($);

  var links = [];
  var titles = [];
  var summaries = [];

  var listItems = $("article").each((i, element) => {
    links.push("https://nytimes.com" + $(element).find("a").attr("href"));
    titles.push($(element).find("h2").text());
    summaries.push($(element).find("p").text());
  });

  // console.log(listItems);
  console.log(links);
  console.log(titles);
  console.log(summaries);
})










// ROUTES
app.use(require('./routes/htmlRoutes'));

// Simple index route for development
app.get("/", function(req, res) {
    res.render(path.join(__dirname + "/views/index"));
  });

app.get("/saved", function(req, res) {
  res.render(path.join(__dirname + "/views/saved"));
});

// LISTEN
app.listen(PORT, function() {
    console.log("App running at http://localhost:" + PORT);
});

module.exports = app;