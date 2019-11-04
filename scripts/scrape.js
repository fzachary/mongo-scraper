// DEPENDENCIES
const cheerio = require('cheerio');
const axios = require('axios');

var scrapeArticles = function (callback) {

    // Get the body of the HTML with the request
    axios.get('https://www.nytimes.com').then(response => {
        // Load that into Cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        // Create an array to store the articles
        let articles = [];

        // Now, we grab the articles
        $('article h2').each(function(i, element) {

            // Save the result in an empty object
            let result = {};
            // Add the text and href of every link, and summary and byline, saving them to the object
            result.headline = $(element).text().trim();
            result.summary = $(element).parents().siblings('p').text().trim();
            result.url = "https://www.nytimes.com" + $(element).parents("a").attr("href");
            console.log(result);

            articles.push(result);
        });
        callback(articles);
    });
};

module.exports = scrapeArticles;