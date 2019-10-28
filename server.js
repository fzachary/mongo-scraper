// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");

// Require the model for accessing the "article" collection
// ....

// Establish a PORT and Initialize Express
var PORT = process.env.PORT || 3000;
const app = express();

// Set up Morgan
app.use(logger("dev"));
// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/mongoscraper ", { useNewUrlParser: true });

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Simple index route
app.get("/", function (req, res) {
    res.render('index');
})

// Connect to MongoDB
// ....

// Mongoose
// var mongoose = require("mongoose");

// Start the server
app.listen(PORT, function() {
    console.log("Server listening at http://localhost:" + PORT);
});

module.exports = app;