// DEPENDENCIES
const Note = require('../models/Note');
const createDate = require('../scripts/date');

module.exports = db => {

    return {
        getNote: function(data, callback) {
            Note.find({ _articleId: data._id}, callback);
        },
        saveNote: function(data, callback) {
            var newNote = {
                _articleId: data._id,
                date: createDate(),
                body: data.body
            };

            Note.create(newNote, function(err, doc) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(doc);
                    callback(doc);
                }
            });
        },
        deleteNote: function(data, callback) {
            Note.remove({ _id: data._id }, callback);
        } 
    };
}
