$(document).ready(function() {
    // Get ref to article container
    var articleContainer = $(".article-container");
    // Event listeners
    $(document).on("click", "a.unsave-article", removeSaved);
    $(document).on("click", "a.notes", articleNotes);
    $(document).on("click", "a.note-save", saveNote);
    $(document).on("click", "a.note-delete", deleteNote);
    $(document).on("click", "a.clear", clearArticles);

    function loadPage() {
        // Empty article container and run AJAX for any saved articles
        articleContainer.empty();
        $.getJSON("/api/articles/?saved=true").then(function(data) {
            if (data && data.length) {
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
        var card = $("<div class='card'>").append("<div class='card-content'>");
        var cardHeader = $("<span class='card-title'>").append(
            $("<h3>").append($("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                .attr("href", article.url)
                .text(article.headline),
                $("<p class='article-summary'>").text(article.summary),
                $("<a class='waves-effect waves-light btn red unsave-article'>Delete from Saved</a>").attr("data-_id", article._id),
                $("<a class='waves-effect waves-light btn notes' href='#modal'>Article Notes</a>").attr("data-id", article._id)));

        card.append(cardHeader);
        // Attach the article's ID to the JQuery element
        card.data("_id", article._id);
        // Return the constructed card
        return card;
    }

    function renderEmpty () {
        // Renders HTML to the page saying there are no articles to view
        var emptyAlert = $([
            "<div class='row'>",
            "<div class='alert-warning'>",
            "<h4>Uh Oh. Looks like we don't have any saved articles</h4>",
            "</div>",
            "<div class='card'>",
            "<span class='card-title card-header'>",
            "<h3>What would you like to do?</h3>",
            "</span>",
            "<div class='card-action'>",,
            "<a href='/' class='waves-effect waves-light btn'>Browse Articles</a>",
            "</div>",
            "</div>",
            "</div>"
        ].join(""));
        
        // Append this data to the page
        articleContainer.append(emptyAlert);
    }

    // Function to render note items to our notes modal
    // Sets up an array of notes to render after finished
    function renderNotesList(data) {

        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
          // If we have no notes, just display a message explaining this
          currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
          notesToRender.push(currentNote);
        } else {
          // If we do have notes, go through each one
          for (var i = 0; i < data.notes.length; i++) {
            // Constructs an li element to contain our noteText and a delete button
            currentNote = $("<li class='list-group-item note'>")
              .text(data.notes[i].noteText)
              .append($("<button class='btn btn-danger note-delete'>x</button>"));
            // Store the note id on the delete button for easy access when trying to delete
            currentNote.children("button").data("_id", data.notes[i]._id);
            // Adding our currentNote to the notesToRender array
            notesToRender.push(currentNote);
          }
        }
        // Now append the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
      }

    // Function to delete articles and headlines
    function removeSaved() {

        var articleToRemove = {};

        articleToRemove._id = $(this).attr("data-_id");
        articleToRemove.saved = false;
        console.log(articleToRemove);

        $.ajax({
            method: "PATCH",
            url: `/api/articles/${articleToRemove}`,
            data: articleToRemove
        }).then(function(data) {
            if (data.ok) {
                loadPage();
            }
        });
    }

    // Function to handle opening the notes modal and displaying the notes
    function articleNotes() {
        var currentArticle = $(this)
        .parents(".card")
        .data();
        // Grab any notes with this headline/article id
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
        // Constructing our initial HTML to add to the notes modal
        var modalText = $("<div class='container-fluid text-center'>").append(
            $("<h4>").text("Notes For Article: " + currentArticle._id),
            $("<hr>"),
            $("<ul class='list-group note-container'>"),
            $("<textarea placeholder='New Note' rows='4' cols='60'>"),
            $("<button class='btn btn-success save'>Save Note</button>")
        );
        // Adding the formatted HTML to the note modal
        bootbox.dialog({
            message: modalText,
            closeButton: true
        });
        var noteData = {
            _id: currentArticle._id,
            notes: data || []
        };
        // Adding some information about the article and article notes to the save button for easy access
        // When trying to add a new note
        $(".btn.save").data("article", noteData);
        // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
        renderNotesList(noteData);
        });
    }

    // Function to handle the saving of a new note for an article
    function saveNote() {

        var noteData;
        var newNote = $(".modal.textarea").val().trim();
        // If there is data typed in, format it and post to the api and send the data as well
        if (newNote) {
            noteData = { _articleId: $(this).data("article")._id, body: newNote };
            $.post("/api/notes", noteData).then(function() {
                $(".modal1").hide();
            });
        }
    }

    // Function to handle deletion of a note
    function deleteNote() {

        var noteToDelete = $(this).data("_id");
        // DELETE request to the API
        $.ajax({
            url: `/api/notes/${noteToDelete}`,
            method: "DELETE"
        }).then(function() {
            loadPage();
            M.toast({ html: data.message});
        });
    }

    function clearArticles() {

        $.get("/api/clear")
            .then(function() {
                articleContainer.empty();
                loadPage();
            });
    }

    loadPage();

});
