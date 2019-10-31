// REQUIRE MONGOOSE
const mongoose = require("mongoose");

// Get the SCHEMA CONSTRUCTOR
const Schema = mongoose.Schema;

// Use the constructor to create a new ARTICLE OBJECT
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: false
    }
});

// Create model from the Schema using the model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;