$(document).ready(function() {
  // Hide the register and notes containers initially
  $("#register-container").hide();
  $("#notes-container").hide();

  // Show the register container when the register link is clicked
  $("#register-link").click(function(e) {
    e.preventDefault();
    $("#login-container").hide();
    $("#register-container").show();
  });

  // Show the login container when the login link is clicked
  $("#login-link").click(function(e) {
    e.preventDefault();
    $("#register-container").hide();
    $("#login-container").show();
  });

  // Register a new user
  $("#register-btn").click(function() {
    var name = $("#register-name").val();
    var email = $("#register-email").val();
    var password = $("#register-password").val();

    $.ajax({
      url: "https://notes-api.dicoding.dev/v1/register",
      method: "POST",
      data: {
        name: name,
        email: email,
        password: password
      },
      success: function(response) {
        alert("Registration successful. Please log in.");
        $("#register-name").val("");
        $("#register-email").val("");
        $("#register-password").val("");
        $("#login-container").show();
        $("#register-container").hide();
      },
      error: function(xhr, status, error) {
        var errorMessage = JSON.parse(xhr.responseText).message;
        $("#register-error-msg").text(errorMessage);
      }
    });
  });

  // Create a note
  function createNote() {
    var title = $("#note-title").val();
    var body = $("#note-body").val();
    var accessToken = localStorage.getItem("accessToken");

    $.ajax({
      url: "https://notes-api.dicoding.dev/v1/notes",
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken
      },
      data: {
        title: title,
        body: body
      },
      success: function(response) {
        var note = response.data;
        var notesContainer = $("#notes-container");

        var noteElement = $("<div class='note'>");
        noteElement.append("<h2>" + note.title + "</h2>");
        noteElement.append("<p>" + note.body + "</p>");
        noteElement.append("<button class='archive-btn' data-note-id='" + note.id + "'>Archive</button>");
        noteElement.append("<button class='delete-btn' data-note-id='" + note.id + "'>Delete</button>");

        notesContainer.append(noteElement);

        $("#note-title").val("");
        $("#note-body").val("");
      },
      error: function(xhr, status, error) {
        var errorMessage = JSON.parse(xhr.responseText).message;
        alert("Error: " + errorMessage);
      }
    });
  }

  // Show create note form
  function showCreateNoteForm() {
    $("#notes-container").hide();
    $("#create-note-container").show();
  }

  // Hide create note form
  function hideCreateNoteForm() {
    $("#create-note-container").hide();
    $("#notes-container").show();
  }

  // Event listener for add new note button
  $("#add-note-btn").click(function() {
    showCreateNoteForm();
  });

  // Event listener for create note form cancel button
  $("#cancel-btn").click(function() {
    hideCreateNoteForm();
  });

  // Event listener for create note form submit
  $("#create-note-form").submit(function(e) {
    e.preventDefault();
    createNote();
    hideCreateNoteForm();
  });

  // Load user's notes
  function loadNotes() {
    var accessToken = localStorage.getItem("accessToken");

    $.ajax({
      url: "https://notes-api.dicoding.dev/v1/notes",
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken
      },
      success: function(response) {
        var notes = response.data;
        var notesContainer = $("#notes-container");
        notesContainer.empty();

        if (notes.length === 0) {
          notesContainer.append("<p>No notes found.</p>");

          // Add form to create a new note
          var createNoteForm = $("<form id='create-note-form'>");
          createNoteForm.append("<label for='note-title'>Title:</label>");
          createNoteForm.append("<input type='text' id='note-title' required>");
          createNoteForm.append("<label for='note-body'>Body:</label>");
          createNoteForm.append("<textarea id='note-body' required></textarea>");
          createNoteForm.append("<button type='submit'>Create Note</button>");
          createNoteForm.append("<button id='cancel-btn' type='button'>Cancel</button>");
          notesContainer.append(createNoteForm);
        } else {
          notes.forEach(function(note) {
            var noteElement = $("<div class='note'>");
            noteElement.append("<h2>" + note.title + "</h2>");
            noteElement.append("<p>" + note.body + "</p>");
            noteElement.append("<button class='archive-btn' data-note-id='" + note.id + "'>Archive</button>");
            noteElement.append("<button class='delete-btn' data-note-id='" + note.id + "'>Delete</button>");

            if (note.archived) {
              noteElement.addClass("archived");
              noteElement.find(".archive-btn").text("Unarchive");
            }

            notesContainer.append(noteElement);
          });
        }
      },
      error: function(xhr, status, error) {
        var errorMessage = JSON.parse(xhr.responseText).message;
        alert("Error: " + errorMessage);
      }
    });
  }

  // Delete a note
  $(document).on("click", ".delete-btn", function() {
    if (confirm("Are you sure you want to delete this note?")) {
      var noteId = $(this).data("note-id");
      var accessToken = localStorage.getItem("accessToken");

      $.ajax({
        url: "https://notes-api.dicoding.dev/v1/notes/" + noteId,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + accessToken
        },
        success: function(response) {
          loadNotes();
        },
        error: function(xhr, status, error) {
          var errorMessage = JSON.parse(xhr.responseText).message;
          alert("Error: " + errorMessage);
        }
      });
    }
  });

  // Login function
  function login() {
    var email = $("#login-email").val();
    var password = $("#login-password").val();

    $.ajax({
      url: "https://notes-api.dicoding.dev/v1/login",
      method: "POST",
      data: {
        email: email,
        password: password
      },
      success: function(response) {
        var accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        loadNotes();
        $("#login-email").val("");
        $("#login-password").val("");
        $("#login-container").hide();
        $("#notes-container").show();
      },
      error: function(xhr, status, error) {
        var errorMessage = JSON.parse(xhr.responseText).message;
        $("#error-msg").text(errorMessage);
      }
    });
  }

  // Event listener for login form submit
  $("#login-form").submit(function(e) {
    e.preventDefault();
    login();
  });
});
