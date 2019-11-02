$(document).ready(function() {
    // Get ref to article container
    var articleContainer = $(".article-container");
    // Event listeners
    $(document).on("click", "a.unsave-article", removeSaved);
    $(document).on("click", "a.notes", articleNotes);
    $(document).on("click", "a.save", saveNote);
    $(document).on("click", "a.delete-note", deleteNote);
    $(document).on("click", "a.clear", clearArticles);

    function loadPage() {
        // Empty article container and run AJAX for any saved articles
        $.getJSON("/api/articles?saved=true").then(function(data) {

            articleContainer.empty();
            if ( data && data.length ) {
                renderArticles(data);
            } else {
                renderEmpty();
            }
        });
    }

    // function renderArticles(articles) {
        
    //     var articleCards = [];

    //     for (var i = 0; i < articles.length; i++) {
    //         articleCards.push(createCard(articles[i]));
    //     }
    //     articleContainer.append(articleCards);
    // }

    // function createCard(article) {
    //     var card = $("<div class='card'>");
    //     var cardHeader = $("<div class='card-header'>").append(
    //         $("<h3>").append(
    //             $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
    //             .attr("href", article.url)
    //             .text(article.headline),
    //         $("<a class='waves-effect waves-light btn save-article'>Delete from Saved</a>"),
    //         $("<a class='waves-effect waves-light btn notes'>Article Notes</a>")
    //         )
    //     );

    //     var cardBody = $("<div class='card-body'>").text(article.summary);

    //     card.append(cardHeader, cardBody);

    //     card.data("_id", article._id);
        
    //     return card;
    // }

    function renderEmpty () {
        // Renders HTML to the page saying there are no articles to view
        
        // Append this data to the page
        articleContainer.empty();

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
                    .append($("<a class='btn-floating btn-large waves-effect waves-light red delete-note'>X</button>"));

                currentNote.children("button").data("_id", data.notes[i]._id);

                notesToRender.push(currentNote);
            }
        }

        $("note-container").append(notesToRender);
    }

    // Function to delete articles and headlines
    function removeSaved() {

        var articleToRemove = $(this).attr("data-_id");

        console.log(articleToRemove);

        $(this)
            .parents(".card")
            .remove();

        $.ajax({
            method: "PUT",
            url: `/api/remove/${articleToRemove}`
        }).then(function(data) {
            if (!data.saved) {
                loadPage();
            }
        });
    }

    // Function to handle opening the notes modal and displaying the notes
    function articleNotes() {
        var currentArticle = $(this).attr("data-_id");

        console.log(currentArticle);

        $.get(`api/articles/${currentArticle}`).then(function(data) {
            
            // Initial HTML to add to the modal
            // var modalText = $("<div class='container-fluid text-center'>").append(
            //     $("<h4>").text("Notes For Article: " + currentArticle),
            //     $("<hr>"),
            //     $("<ul class='list-group note-container'>"),
            //     $("<textarea placeholder='New Note' rows='4' cols='60'>"),
            //     $("<button class='btn btn-success save'>Save Note</button>")
            // );

            var noteData = {
                _id: currentArticle,
                notes: data
            };
            // Adding info about the article and article notes to the save button for easy access
            // $(".btn.save").data("article", noteData);
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
