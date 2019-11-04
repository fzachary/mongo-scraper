$(document).ready(function() {
    // Reference the article container where the content will go
    var articleContainer = $(".article-container");
    // Call the scrapeArticles function when the scrape articles button is clicked
    $(document).on("click", "a.scrape-new", scrapeArticles);
    // Call the saveArticle function when the save button is clicked
    $(document).on("click", "a.save-article", saveArticle);
    // Call the renderEmpty function when the clear articles button is clicked
    $(document).on("click", "a.clear", renderEmpty);

    // Function for when the page loads
    function loadPage () {

        articleContainer.empty();
        // Run an AJAX request for any unsaved headlines
        $.getJSON("/api/articles/?saved=false").then(function(data) {

            console.log(data);
            // Render the headlines if there are any
            if (data && data.length) {
                renderArticles(data);
            } else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {

        // Appends HTML containing our article data to the page
        var articleCards = [];
        // Pass each article JSON to the createCard function which returns a card with the article info inside
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(createCard(articles[i]));
        }
            // Append the cards to the container
            articleContainer.append(articleCards);
    }

    // Function for creating the cards for the articles
    function createCard(article) {
        // Takes in a JSON object, constructs a JQuery element containing the HTML for the article card
        var card = $("<div class='card'>").append("<div class='card-content'>");
        var cardHeader = $("<span class='card-title'>").append(
            $("<h3>").append($("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                .attr("href", article.url)
                .text(article.headline),
                $("<p class='article-summary'>").text(article.summary),
                $("<a class='waves-effect waves-light btn save-article'>Save Article</a>").attr("data-_id", article._id)));

        card.append(cardHeader);
        // Return the constructed card
        return card;
    }

    // Function for clearing the article container
    function renderEmpty () {

        $.ajax({
            method: "DELETE",
            url: '/api/clear',
            success: function(data) {
                console.log("success");
            },
            error: function() {
                console.log("error");
            }
        })
        .then(function(data) {
            return data;
        });

        // Renders HTML to the page saying there are no articles to view
        var emptyAlert = $([
                "<div class='row'>",
                "<div class='alert-warning'>",
                "<h4>Uh Oh. Looks like we don't have any articles</h4>",
                "</div>",
                "<div class='card'>",
                "<span class='card-title card-header'>",
                "<h3>What would you like to do?</h3>",
                "</span>",
                "<div class='card-action'>",
                "<a class='waves-effect waves-light btn scrape-new'>Scrape New Articles</a>",
                "<a href='/saved' class='waves-effect waves-light btn saved'>Go to Saved Articles</a>",
                "</div>",
                "</div>",
                "</div>"
            ].join(""));
        // Append this data to the page
        articleContainer.empty()
        .append(emptyAlert);

        console.log("emptied");
    }

    // Function for saving an article
    function saveArticle () {

        // Called when user wants to save an article
        // Retrieve article info using the .data method
        var articleToSave = {};
        articleToSave._id = $(this).attr("data-_id");
        articleToSave.saved = true;
        console.log(articleToSave);


        // Use a PUT METHOD to update existing record in the collection
        $.ajax({
            method: "PATCH",
            url: `/api/articles/${articleToSave}`,
            data: articleToSave
        })
        .then(function(data) {
            if(data.ok) {
                loadPage();
            }
        });
    }

    // Function for scraping articles
    function scrapeArticles () {

        $.get("/api/fetch")
        .then(function (data) {
            // If we can scrape articles and compare them to the articles already in the collection, then render the new articles and let the user know how many unique articles were saved
            loadPage();
            M.toast({ html: data.message });
        });
    }

    loadPage();
    
});
