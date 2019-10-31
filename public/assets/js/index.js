$(document).ready(function() {
    // Reference the article container where the content will go
    var articleContainer = $(".article-container");
    // Call the scrapeArticles function when the scrape articles button is clicked
    $(document).on("click", ".scrape-new", scrapeArticles);
    // Call the clearArticles function when the clear articles button is clicked
    $(document).on("click", ".clear", clearArticles);
    // Call the saveArticle function when the save button is clicked
    $(document).on("click", "save-article", saveArticle);

    // Function for when the page loads
    function loadPage () {
        // Run an AJAX request for any unsaved headlines
        $.get("/api/headlines?saved=false").then(function(data) {
            articleContainer.empty();
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
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                .attr("href", article.url)
                .text(article.headline),
            $("<a class='waves-effect waves-light btn save-article'>Save Article</a>")
            )
        );

        var cardBody = $("<div class='card-body'>").text(article.summary);

        card.append(cardHeader, cardBody);
        // Attach the article's ID to the JQuery element
        card.data("_id", article.id);
        // Return the constructed card
        return card;
    }

    // Function for clearing the article container
    function renderEmpty () {
        // Renders HTML to the page saying there are no articles to view
        var emptyAlert = $(
            [
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
                "<a href='/saved' class='waves-effect waves-light btn'>Go to Saved Articles</a>",
                "</div>",
                "</div>",
                "</div>"
            ].join("")
        );
        // Append this data to the page
        articleContainer.append(emptyAlert);

        console.log("emptied");
    }

    // Function for saving an article
    function saveArticle () {
        // Called when user wants to save an article
        // Retrieve article info using the .data method
        var articleToSave = $(this)
            .parents(".card")
            .data();
        
        // Remove card
        $(this)
            .parents(".card")
            .remove();

        articleToSave.saved = true;
        // Use a PUT METHOD to update existing record in the collection
        $.ajax({
            method: "PUT",
            url: "/api/headlines" + articleToSave._id,
            data: articleToSave
        }).then(function(data) {
            if(data.saved) {
                loadPage();
            }
        });
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
