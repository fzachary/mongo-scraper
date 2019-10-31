$(document).ready(function() {
    // Get ref to article container
    var articleContainer = $(".article-container");
    // Event listeners
    $(document).on("click", "btn.delete", deleteArticle);
    $(document).on("click", "btn.notes", articleNotes);
    $(document).on("click", "btn.save", saveNote);
    $(document).on("click", "btn.delete-note", deleteNote);
    $(".clear").on("click", clearArticles);

    function loadPage() {
        // Empty article container and run AJAX for any saved articles
        $.get("/api/headlines?saved=true").then(function(data) {
            articleContainer.empty();
            if ( data && data.length ) {
                renderArticles(data);
            } else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        
        var articleCards = [];

        for (var i = 0; i < articles.length; i++) {
            articleCards.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    function createCard(article) {
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                .attr("href", article.url)
                .text(article.headline),
            $("<a class='waves-effect waves-light btn save-article'>Delete from Saved</a>"),
            $("<a class='waves-effect waves-light btn notes'>Article Notes</a>")
            )
        );

        var cardBody = $("<div class='card-body'>").text(article.summary);

        card.append(cardHeader, cardBody);

        card.data("_id", article._id);
        
        return card;
    }

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

    // Function to render note items to our notes modal
    // Sets up an array of notes to render after finished
    function renderNotesList(data) {

        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
            notesToRender.push(currentNote);
        } else {
            for (var i = 0; i < data.notes.length; i++) {

                currentNote = $("<li class='list-group-item note'>")
                    .text(data.notes[i].noteText)
                    .append($("<button class='waves-effect waves-light btn delete-note'>X</button>"));

                currentNote.children("button").data("_id", data.notes[i]._id);

                notesToRender.push(currentNote);
            }
        }

        $("note-container").append(notesToRender);
    }

    // Function to delete articles and headlines
    function deleteArticle() {

        var articleToDelete = $(this)
            .parents(".card")
            .data();

        $(this)
            .parents(".card")
            .remove();

        $.ajax({
            method: "DELETE",
            url: "api/headlines/" + articleToDelete._id
        }).then(function(data) {
            if (data.ok) {
                loadPage();
            }
        });
    }

    // Function to handle opening the notes modal and displaying the notes
    function articleNotes(event) {
        var currentArticle = $(this)
            .parents(".card")
            .data();

        $.get("api/notes/" + currentArticle._id).then(function(data) {
            
            // Initial HTML to add to the modal
            var modalText = $("<div class='container-fluid text-center'>").append(
                $("<h4>").text("Notes For Article: " + currentArticle._id),
                $("<hr>"),
                $("<ul class='list-group note-container'>"),
                $("<textarea placeholder='New Note' rows='4' cols='60'>"),
                $("<button class='btn btn-success save'>Save Note</button>")
            );
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            // Adding info about the article and article notes to the save button for easy access
            $(".btn.save").data("article", noteData);
            // renderNotesList will populate the HTML inside of the modal
            renderNotesList(noteData);
        });
    }

    // Function to handle the saving of a new note for an article
    function saveNote() {

        var noteData;
        var newNote = $(".bootbox-body textarea")
            .val()
            .trim();
        // If there is data typed in, format it and post to the api and send the data as well
        if (newNote) {
            noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
            $.post("/api/notes", noteData).then(function() {
                bootbox.hideAll();
            });
        }
    }

    // Function to handle deletion of a note
    function deleteNote() {

        var noteToDelete = $(this).data("_id");
        // DELETE request to the API
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            bootbox.hideAll();
        });
    }

    function clearArticles() {

        $.get("/api/clear")
            .then(function() {
                articleContainer.empty();
                loadPage();
            });
    }
});

$(document).ready(function() {
    $('.modal').modal();
});