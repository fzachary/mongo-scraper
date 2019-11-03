// REQUIRE MONGOOSE
const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Use the constructor to create a new ARTICLE OBJECT
const ArticleSchema = new Schema({
    headline: {
        type: String,
        require: true,
        unique: false,
    },
    summary: {
        type: String,
        required: true
    },
    date: String,
    saved: {
        type: Boolean,
        default: false
    }
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;