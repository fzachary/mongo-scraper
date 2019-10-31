// Dependencies
const express = require('express');
const router = require('express').Router();
// const db = require('../models');

module.exports = (db) => {
    // Load home page
    router.get('/', function (req, res) {
        res.send('index')
    });

    // Load saved articles page
    router.get('/saved', function (req, res) {
        res.send('saved')
    });

    // 404 page for any unmatched results
    router.get('*', function (req, res) {
        res.send('404');
    });

    return router;
};