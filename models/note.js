// DEPENDENCIES
var mongoose = require('mongoose');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the constructor, create a note object
var noteSchema = new Schema({
    _articleId: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
    date: String,
    body: String
});

var Note = mongoose.model('Note', noteSchema);

module.exports = Note;