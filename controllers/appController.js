const cheerio = require('cheerio');
const axios = require('axios');

module.exports = (db) => {
    return {
        // Scrape articles
        scrapeArticles: function (req, res) {
            
            // Get the body of the HTML with the request
            axios.get("https://www.nytimes.com").then(response => {
                // Load that into Cheerio and save it to $ for a shorthand selector
                const $ = cheerio.load(response.data);
                // Now, we grab the articles
                $("div.assetWrapper").each(function(i, element) {
                    
                    // Save the result in an empty object
                    let result = {};
                    // Add the text and href of every link, and summary and byline, saving them to the object
                    result.headline = $(element).find("h2").attr("class", "esl82me0").text();
                    result.link = "https://nytimes.com/" + $(element).children().children().find("a").attr("href");
                    result.summary = $(element).children().children().find("div").attr("class", "e18972d71").children().find("p").text();
                    console.log(result.headline, result.link, result.summary);                    
                    // Create a new Article using the `result` object built from scraping
                    db.Article.create(result)
                        .then(function(dbArticle) {
                            console.log(dbArticle);
                        })
                        .catch(function(err) {
                            console.log(err)
                        });
                });
                // Send a message to the client
                console.log("Scrape Complete");
            });
        },
        // Get all articles
        getArticles: function (req, res) {
            db.Article.find({ saved : false }.sort({ date: 1 })).then(function(err, found) {
                if(err) {
                    console.log(err);
                } else {
                    res.json(found);
                    console.log(found);
                }
            })
            .then(function(dbArticle) {
                console.log(dbArticle);
                let hbsObject = {
                    articles: dbArticle
                };
                res.render("index", hbsObject);
                console.log(hbsObject);
            })
            .catch(function (err) {
                res.json(err);
            });
            res.redirect('/');
        },
        getSavedArticles: function (req, res) {
            db.Article.find({ saved: true })
                .then(function(retrievedArticles) {
                    console.log(retrievedArticles);
                    let hbsObject = {
                        articles: retrievedArticles
                    };
                    res.render("saved", hbsObject);
                })
                .catch(function(err) {
                    res.json(err);
                });
        },
        saveArticle: function (req, res) {
            db.Article.updateOne({ _id: req.params.id }, { $set: { saved: true }})
                .then(function(data) {
                    res.json(data);
                })
                .catch(function(err) {
                    res.json(err);
                });
        },
        unsaveArticle: function (req, res) {
            db.Article.updateOne({ _id: req.params.id }, { $set: { saved: false }})
                .then(function(data) {
                    res.json(data);
                })
                .catch(function(err) {
                    res.json(err);
                });
            console.log("updated" + req.params.id);
        },
        getArticleNotes: function (req, res) {
            db.Article.findOne({ _id: req.params.id })
                .populate("Note")
                .then(function(dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function(err) {
                    res.json(err);
                });
        },
        postNote: function (req, res) {
            db.Note.create(req.body)
                .then(function(dbNote) {
                    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
                })
                .then(function(dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function(err) {
                    res.json(err);
                });
        },
        deleteNote: function (req, res) {
            db.Note.deleteOne({ _id: req.params.id })
                .then(function(dbNote) {
                    return db.Article.findOneAndUpdate({ note: req.params.id }, { $pullAll: [{ note: req.params.id }]});
                })
                .then(function(dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function(err) {
                    res.json(err);
                });
        }
    };
};
