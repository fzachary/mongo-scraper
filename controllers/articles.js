// REQUIRE our scripts
const scrapeArticles = require('../scripts/scrape');
const createDate = require('../scripts/date');

// REQUIRE our models
const Article = require('../models/Article');

module.exports = {

    fetchArticles: function (callback) {
        scrapeArticles(function(data) {
            let articles = data;
            for (var i = 0; i < articles.length; i++) {
                articles[i].date = createDate();
                articles[i].saved = false;
            }

            Article.collection.insertMany(articles, { ordered: false }, function(err, docs) {
                callback(err, docs);
            });
        });
    },
    deleteArticles: function(query, callback) {
        Article.remove(query, callback);
    },
    getArticles: function(query, callback) {
        Article.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc) {
            callback(doc);
        });
    },
    updateArticles: function(query, callback) {
        Article.update({ _id: query._id }, { $set: query }, {}, callback);
    }
}