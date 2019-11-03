// DEPENDENCIES
const scrapeArticles = require('../scripts/scrape');

// CONTROLLERS
const articlesController = require('../controllers/articles');
const notesController = require('../controllers/notes');

module.exports = function (router) {

    // ROUTE to scrape the articles
    router.get('/api/fetch', (req, res) => {
        articlesController.fetchArticles(function(err, articles) {
            if(!articles || articles.insertedCount === 0) {
                res.json({ message: "no new articles" });
            }
            else {
                res.json({ message: `Added ${articles.insertedCount} new articles` });
            }
        });
    });
    router.get("/api/articles", function (req, res) {
        let query = {};

        if (req.query.saved) {
            query = req.query
        }

        articlesController.getArticles(query, function(articles) {
            res.json(articles);
        });
    });
    router.delete("/api/articles/:id", function(req, res) {
        let query = {};
        query._id = req.params.id;
        articlesController.deleteArticles(query, function(err, article) {
            res.json(article);
        });
    });
    router.patch("/api/articles", function(req, res) {
        articlesController.updateArticles(req.body, function(err, articles) {
            res.json(articles);
        });
    });
    router.get("/api/notes/:_articleId?", function(req, res) {
        let query = {};
        if (req.params._articleId) {
            query._id = req.params._articleId;
        }

        notesController.getNote(query, function(err, note) {
            res.json(note);
        });
    });
    router.delete("/api/notes/:id", function(req, res) {
        let query = {};
        query._id = req.params.id;
        notesController.deleteNote(query, function(err, note) {
            res.json(note);
        });
    });
    router.post("/api/notes", function(req, res) {
        notesController.saveNote(req.body, function(note) {
            res.json(note);
        });
    });
}




// // DEPENDENCIES ==========================
// const router = require('express').Router();


// // ROUTES ================================
// module.exports = (app, db) => {
    
//     const AppController = require('../controllers/appController')(db);

//     // App
//     app.get('/api/articles?saved=false', AppController.getArticles);
//     app.get('/api/fetch', AppController.scrapeArticles);
//     app.post('/api/notes/:id', AppController.postNote);
//     app.get('/api/articles/:id', AppController.getArticleNotes);
//     app.delete('/note:id', AppController.deleteNote);
//     app.put('/api/remove/:id', AppController.unsaveArticle);
//     app.get('/api/articles?saved=true', AppController.getSavedArticles);
//     app.put('/api/save/:id', AppController.saveArticle);

//     return router;
// };
