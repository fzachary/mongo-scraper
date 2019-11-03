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
        $('article').each(function(i, element) {

            // Save the result in an empty object
            let result = {};
            // Add the text and href of every link, and summary and byline, saving them to the object
            result.headline = $(element).children('h2').text().trim();
            result.summary = $(element).children('p').text().trim();
            console.log(result);

            articles.push(result);
        });
        callback(articles);
    });
}

module.exports = scrapeArticles;