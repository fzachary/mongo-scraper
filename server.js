// Dependencies
var express = require("express");

// Establish a PORT and Initialize Express
var PORT = process.env.PORT || 3000;

var app = express();

// Handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Controllers
// ....

// Connect to MongoDB
// ....

// Mongoose
// ....

// Start the server
app.listen(PORT, function() {
    console.log("Server listening at http://localhost:" + PORT);
});