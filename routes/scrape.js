// // DEPENDENCIES ===========================================
// const express = require("express");
// const cheerio = require("cheerio");
// const router = express.Router();
// const db = require("../models");

// // ROUTES =================================================

// // GET ROUTE for scraping articles
// app.get("/scrape", function (req, res) {

//     // Grab the html with axios
//     axios.get("https://www.nytimes.com/")
//       .then(function(response) {
  
//       // Load the data into cheerio and save it as "$" for an easy selector
//       var $ = cheerio.load(response.data);
  
//       // Grab every h2 within an article tag
//       $("article h2").each(function (i, element) {
  
//         // Save into a results object
//         var results = {};
  
//         // Add the href of every link
//         results.title = $(this).text();
//         results.link = $(this).children("a").attr("href");
  
//         // Create a new Article using the "result" object built from scraping
//         db.Article.create(result)
//           .then(function(dbArticle) {
  
//           // View the added result in the console
//           console.log(dbArticle);
//         })
//           .catch(function(err) {
  
//           // Log an error if occurred
//           console.log(err)
//         });
//       });
  
//       // Send a message notifying completion of the scrape
//       res.send("Scrape Complete");
//     });
// });