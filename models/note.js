// DEPENDENCIES
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the constructor, create a note object
var noteSchema = new Schema({
    title: String,
    body: String
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;