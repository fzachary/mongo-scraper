// DEPENDENCIES
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
// Path for Development
const path = require("path");

// DATABASE/MONGOOSE
// Require the model for accessing the "article" collection
// const db = require("./models");
// mongoose.connect("mongodb://localhost/mongo-scraper", { useNewUrlParser: true });

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