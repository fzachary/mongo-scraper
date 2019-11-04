// DEPENDENCIES ==========================
const router = require('express').Router();

// ROUTES ================================
module.exports = db => {

    // ROUTE to render the home page
    router.get('/', (req, res) => {
        res.render('index');
    });
    // ROUTE to render the saved page
    router.get('/saved', (req, res) => {
        res.render('saved');
    });
    // ROUTE to render the 404 page
    router.get('*', (req, res) => {
        res.render("404");
    });

    return router;
}