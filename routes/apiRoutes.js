// DEPENDENCIES ==========================
const router = require('express').Router();

// ROUTES ================================
module.exports = db => {

    const ArticlesController = require('../controllers/articles')(db);
    const NotesController = require('../controllers/notes')(db);   

    // App
    router.get('/api/fetch', function(req, res) {
        ArticlesController.fetchArticles(function(err, articles) {
            if (!articles || articles.insertedCount === 0) {
                res.json({
                    message: "No new articles!"
                });
            }
            else {
                res.json({
                    message: `Added ${articles.insertedCount} new articles!`
                });
            }
        });
    });
    router.get('/api/articles', function(req, res) {
        var query = {};
        if (req.query.saved) {
            query = req.query;
        } else {
            query = req.query;
        }
        
        ArticlesController.getArticles(query, function(articles) {
            res.json(articles);
        });
    });
    router.patch('/api/articles/:id', function(req, res) {
        var query = {};
        query._id = req.params.id;
        ArticlesController.updateArticles(req.body, function(err, articles) {
            res.json(articles);
        });
    });
    router.get('/api/notes:_articleId?', function(req, res) {
        var query = {};
        if (req.params._articleId) {
            query._id = req.params._articleId;
        }

        NotesController.getNote(query, function(err, note) {
            res.json(note);
        });
    });
    router.delete('/api/notes/:id', function(req, res) {
        var query = {};
        query._id = req.params.id;
        NotesController.deleteNote(query, function(err, note) {
            res.json(note);
        });
    });
    router.post('/api/notes/', function(req, res) {
        NotesController.saveNote(req.body, function(note) {
            res.json(note);
        });
    });
    router.delete('/api/clear', function(req, res) {
        ArticlesController.deleteArticles();
    });

    return router;
};
