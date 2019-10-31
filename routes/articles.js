// DEPENDENCIES =============================================
const express = require("express");
const router = express.Router();
const db = require("../models");

// ROUTES ===================================================

// GET ROUTE changing "saved" boolean to "true"
router.get("/save/:id", (req, res) => {
    db.Article.update({ _id: req.params.id }, { saved: true })
        .then(result => res.redirect("/"))
        .catch(err => res.json(err));
});

// GET ROUTE rendering and populating the saved page
router.get("/saved", (req, res) => {
    db.Article.find({})
        .then(dbArticles => res.render("saved", { articles: dbArticles }))
        .catch(err => res.json(err));
});

// GET ROUTE changing "saved" boolean to "false"
router.get("/unsave/:id", (req, res) => {
    db.Article.update({ _id: req.params.id }, { saved: false })
        .then(result => res.redirect("/saved"))
        .catch(err => res.json(err));
});