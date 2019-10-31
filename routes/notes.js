// DEPENDENCIES =========================================
const express = require("express");
const router = express.Router();
const db = require("../models");

// ROUTES ===============================================

// GET ROUTE to retrieve all notes for a specific article
router.get("/notes/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
    .populate("notes")
    .then(dbNotes => res.json(dbNotes))
    .catch(err => res.json(err));
});

// GET ROUTE to return a single note from the db
router.get("/note/:id", (req, res) => {
    db.Note.findOne({ _id: req.params.id })
    .then(dbNote => res.json(dbNote))
    .catch(err => res.json(err));
});

// POST ROUTE to create a new note in the db
router.post("/newnote", (req, res) => {
    // SAVE the new note in an object so that it can be inserted into the db
    let note = {
        title: req.body.title,
        body: req.body.body,
        articleId
    };
    db.Note.create(note)
        .then(dbNote => {
            // UPDATE the corresponding article with the reference to the note
            db.Article.findOneAndUpdate({ _id: articleId }, { $push: { notes: dbNote._id }}, { new: true})
                .then(data => res.json(dbNote))
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});

// POST ROUTE to delete a note
router.post("/deletenote", (req, res) => {
    db.Note.remove({ _id: req.body.id })
        .then(result => res.json(result))
        .catch(err => res.json(err));
});