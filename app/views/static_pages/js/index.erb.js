$(function() {
  // The taskHtml function wraps each task within <li> tags
  function taskHtml(task) {
    var checkedStatus = task.in_progress || task.done ? "checked" : "";
    var liElement = '<li><div class="view"><input class="toggle" type="checkbox"' +
      " data-id='" + task.id + "'" +
      checkedStatus +
      '><label>' +
       task.title +
       '</label></div></li>';

    return liElement;
  }

  // toggleTask performs API request to toggle value of 'done' field
  function toggleTask(e) {
    var itemId = $(e.target).data("id");
    // console.log(itemId);
    var doneValue = Boolean($(e.target).is(':checked'));
    // console.log("done:", doneValue);
    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    });
  }

  $.get("/tasks").success( function( data ) {
    //var to contain the full list of the various list elements
    var htmlString = "";

    $.each(data, function(index, task) {
      htmlString += taskHtml(task);
    });
    // Extract DOM element w/the class of todo-list from the page.
    var ulTodos = $('.todo-list');
    // Take the HTML string & push it into the HTML element that's
    // stored in the ulTodos variable.
    ulTodos.html(htmlString);

    $('.toggle').change(toggleTask);

  });

  $('#new-form').submit(function(event) {
    // Stop default behavior of reloading page upon form submission
    event.preventDefault();
    // console.log("intercepted ;.)");

    // Extract the value of the item in the text field
    var textbox = $('.new-todo');
    // console.log("Task: ", textbox.val())

    // Create a variable to have the payload for a POST request
    var payload = {
      task: {
        title: textbox.val()
      }
    };
    // POST the payload (the user-submitted data) to the server...
    $.post("/tasks", payload).success(function(data) {
      var htmlString = taskHtml(data);
      // convert the JavaScript representation of a task into HTML
      // append list item into unordered list w/the class: todo-list
      var ulTodos = $('.todo-list');
      ulTodos.append(htmlString);
      // console.log(htmlString);
      // Set up click handler after pushing new items onto the page.
      $('.toggle').click(toggleTask);
    });
  });
});