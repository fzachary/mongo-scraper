// const express = require("express");
// const router = express.Router();
// const db = require("../models");
// const request = require("request");
// const cheerio = require("cheerio");

// // GET ROUTE for scraping the NYT website
// router.get("/scrape", (req, res) => {
//     console.log("Scraped articles");
//     // Get the body of the HTML with the request
//     request("https://www.nytimes.com/", (error, response, body) => {
//         if (!error && response.statusCode === 200) {
//             // Load that into Cheerio and save it to $ for a shorthand selector
//             const $ = cheerio.load(body);
//             let count = 0;
//             // Now, we grab the articles
//             $("article").each(function(i, element) {
//                 // Save an empty result object
//                 let count = i;
//                 let result = {};
//                 // Add the text and href of every link, and summary and byline, saving them to the object
//                 result.title = $(element)
//                     .children('.story-heading')
//                     .children('a')
//                     .attr("href");
//                 result.summary = $(element)
//                     .children('.summary')
//                     .text().trim();
//                 result.byline = $(element)
//                     .children(".byline")
//                     .text().trim()
//                     || "No byline available"

//                 if (result.title && result.link && result.summary) {
//                     db.Article.create(result)
//                         .then(function (dbArticle) {
//                             count++;
//                         })
//                         .catch(function(err) {
//                             return res.json(err);
//                         });
//                 }
//             });

//             res.redirect("/");

//         } else if (error || response.statusCode != 200) {
//             res.send("Error: Unable to obtain new articles");
//         }

//     });
// });

// router.get("/", (req, res) => {
//     db.Article.find({})
//         .then(function(dbArticle) {
//             let hbsObject = {
//                 articles: dbArticle
//             };
//             res.render("index", hbsObject);
//         })
//         .catch(function (err) {
//             res.json(err);
//         });
// });

// router.get("/saved", (req, res) => {
//     db.Article.find({ saved: true })
//         .then(function(retrievedArticles) {
//             let hbsObject = {
//                 articles: retrievedArticles
//             };
//             res.render("saved", hbsObject);
//         })
//         .catch(function(err) {
//             res.json(err);
//         });
// });

// router.get("/articles", (req, res) => {
//     db.Article.find({})
//         .then(function(dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function(err) {
//             res.json(err);
//         });
// });

// router.put("/save/:id", (req, res) => {
//     db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
//         .then(function(data) {
//             res.json(data);
//         })
//         .catch(function(err) {
//             res.json(err);
//         });
// });

// router.put("/remove/:id", (req, res) => {
//     db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false} )
//         .then(function(data) {
//             res.json(data);
//         })
//         .catch(function(err) {
//             res.json(err);
//         });
// });

// router.get("/articles/:id", (req, res) => {
//     db.Article.findById(req.params.id)
//         .populate({
//             path: 'note',
//             model: 'Note'
//         })
//         .then(function(dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function(err) {
//             res.json(err);
//         });
// });

// router.post("note/:id", (req, res) => {
//     db.Note.create(req.body)
//         .then(function(dbNote) {
//             return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id }}, { new: true });
//         })
//         .then(function(dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function(err) {
//             res.json(err);
//         });
// });

// router.delete("/note/:id", (req, res) => {
//     db.Note.findByIdAndRemove(req.params.id)
//         .then(function(dbNote) {
//             return db.Article.findOneAndUpdate({ note: req.params.id }, { $pullAll: [{ note: req.params.id }]});
//         })
//         .then(function(dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function(err) {
//             res.json(err);
//         });
// });

// module.exports = router;