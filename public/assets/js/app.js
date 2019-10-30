$(document).ready(function() {
    // Reference the article container where the content will go
    let articleContainer = $(".article-container");
    // Call the scrapeArticles function when the button is clicked
    $(document).on("click", ".scrape-new", scrapeArticles);
    // Call the clearArticles function when the button is clicked
    $(document).on("click", ".clear", clearArticles);

    // Function for when the page loads
    function loadPage () {

        // Empty the article container
        articleContainer.empty();

    }

    // Function for scraping articles
    function scrapeArticles () {
        $.get("/api/fetch").then(function (data) {
            // If we can scrape articles and compare them to the articles already in the collection, then render the new articles and let the user know how many unique articles were saved
            loadPage();
            bootbox.alert($("<h3 class='center'>").text(data.message));
        });
    }

    function clearArticles () {
        $.get("api/clear").then(function () {
            articleContainer.empty();
            loadPage();
        });
    }
});