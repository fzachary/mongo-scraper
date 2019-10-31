// DEPENDENCIES
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
// Path for Development
const path = require("path");

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


// DATABASE/MONGOOSE
// Require the model for accessing the "article" collection
// const db = require("./models");
mongoose.connect("mongodb://localhost/mongo-scraper", { useNewUrlParser: true });

// EXPRESS & PORT
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(express.urlencoded({ extended: true }));
// Parse request body as JSON
app.use(express.json());
// Handle the public static folder
app.use(express.static("public"));

// HANDLEBARS
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ROUTES
// app.use('/api', require('./routes/apiRoutes'));
// app.use(require('./routes/htmlRoutes'));

// Simple index route for development
app.get("/", function(req, res) {
    res.render(path.join(__dirname + "/views/index"));
  });

app.get("/saved", function(req, res) {
  res.render(path.join(__dirname + "/views/saved"));
});

// LISTEN
app.listen(PORT, function() {
    console.log("Server listening at http://localhost:" + PORT);
});

module.exports = app;