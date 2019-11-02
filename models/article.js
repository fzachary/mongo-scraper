// REQUIRE MONGOOSE
const mongoose = require("mongoose");

// Save a reference to the Scheam constructor
const Schema = mongoose.Schema;

// Use the constructor to create a new ARTICLE OBJECT
const ArticleSchema = new Schema({
    pkey: {
        type: String,
        unique: true
    },
    headline: {
        type: String,
        require: true,
        unique: false,
        sparse: true
    },
    summary: {
        type: String,
        required: false,
        unique: false,
        sparse: true
    },
    link: {
        type: String,
        required: true,
        unique: false
    },
    notes: [{
        body: String,
        date: Date,
        type: Schema.Types.ObjectId,
        ref: "Note"
    }],
    date: {
        type: Date,
        default: Date.now
    },
    saved: {
        type: Boolean,
        default: false,
        required: false,
        unique: false
    }
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;