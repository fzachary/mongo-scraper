// DEPENDENCIES ==========================
const router = require('express').Router();


// ROUTES ================================
module.exports = (app, db) => {
    
    const AppController = require('../controllers/appController')(db);

    // App
    app.get('/api/articles?saved=false', AppController.getArticles);
    app.get('/api/fetch', AppController.scrapeArticles);
    app.post('/api/notes/:id', AppController.postNote);
    app.get('/api/articles/:id', AppController.getArticleNotes);
    app.delete('/note:id', AppController.deleteNote);
    app.put('/api/remove/:id', AppController.unsaveArticle);
    app.get('/api/articles?saved=true', AppController.getSavedArticles);
    app.put('/api/save/:id', AppController.saveArticle);

    return router;
};
