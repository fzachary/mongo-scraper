// REQUIRE MONGOOSE
const mongoose = require("mongoose");

// Save a reference to the Scheam constructor
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
    // summary: {
    //     type: String,
    //     required: false
    // }
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;