const router = require('express').Router();

module.exports = (db) => {

    router.get('/', (req, res) => {
        const obj ={};

        db.Article.find({})
            .populate('Note')
            .then((articles) =>  {
                obj.success = true;
                const hasNote = articles.map((a) => {
                    a.hasNote = a.note !== undefined;
                    return a;
                });
                const renderedArticles = hasNote.map((a, b) => {
                    a.featured = b === 0
                    return a;
                });
                obj.articles = renderedArticles;
                res.render('index', obj)
            })
            .catch(() => {
                obj.success = false;
                res.render('index', obj);
            });
    });

    router.get('/saved', (req, res) => {
        const renderObj = {};

        db.Article.find({ saved: true })
            .populate('note')
            .then((articles) => {
                renderObj.success = true;
                const hasNote = articles.map((a) => {
                    a.hasNote = a.note !== undefined;
                    return a;
                });
                const renderedArticles = hasNote.map((a, b) => {
                    a.featured = b === 0;
                    return a;
                });
                renderObj.articles = renderedArticles;
                res.render('index', renderObj);
            })
            .catch(() => {
                renderObj.success = false;
                res.render('index', renderObj);
            });
    });

    router.get('*', (req, res) => {
        res.render("404");
    })

    return router;
}