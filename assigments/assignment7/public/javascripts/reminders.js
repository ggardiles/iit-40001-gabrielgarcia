// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict';

  window.addEventListener('load', function () {

    var form = document.getElementById('create-reminder-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      form.classList.add('was-validated');
      $.ajax({
        url: "/users/" + $('#inputUserID').val() + "/reminders",
        method: "POST",
        data: JSON.stringify({
          reminder: {
            title: $('#inputTitle1').val(),
            description: $('#inputDescription1').val()
          }
        }),
        contentType: "application/json",
        success: function (data) {
          bootstrap_alert.success('#modal-alert', 'created');
        },
        error: function (xhr, textStatus, errorThrown) {
          bootstrap_alert.error('#modal-alert', JSON.parse(xhr.responseText).error);
        }
      });
    }, false);
  }, false);
})();

bootstrap_alert = function () { }
bootstrap_alert.error = function (id, msg) {
  $(id).html('<div id= "' + id + '" class="alert alert-danger alert-dismissible fade show" role= "alert" >\
    <strong>Error:</strong> ' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
      <span aria-hidden="true">&times;</span>\
    </button></div>')
}
bootstrap_alert.success = function (id, msg) {
  $(id).html('<div id= "' + id + '" class="alert alert-success alert-dismissible fade show" role= "alert" >\
    <strong>Success:</strong> ' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
      <span aria-hidden="true">&times;</span>\
    </button></div>')
}

function openReminderModal() {
  $('.alert').alert('close');
  $('#reminderModal').modal({ backdrop: 'static' })
}
function deleteReminder(userID, reminderID) {
  console.log('delete userID: ' + userID + '  reminderID: ' + reminderID);
  $.ajax({
    url: "/users/"+userID+"/reminders/"+reminderID,
    method: "DELETE",
    contentType: "application/json",
    success: function (data) {
      location.reload();
    },
    error: function (xhr, textStatus, errorThrown) {
      bootstrap_alert.error('#global-alert', JSON.parse(xhr.responseText).error);
    }
  });
}
function searchByTitle(){
  window.location.href = '?title=' + $('#titlesearch').val();
}
function showAllReminders(){
  window.location.href = './reminders';
}
function deleteAllReminders(userID) {
  $.ajax({
    url: "/users/"+userID+"/reminders/",
    method: "DELETE",
    contentType: "application/json",
    success: function (data) {
      showAllReminders();
    },
    error: function (xhr, textStatus, errorThrown) {
      bootstrap_alert.error('#global-alert', JSON.parse(xhr.responseText).error);
    }
  });
}

