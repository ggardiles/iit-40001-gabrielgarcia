// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict';

  window.addEventListener('load', function () {
    var form = document.getElementById('create-user-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      form.classList.add('was-validated');
      $.ajax({
        url: "/users",
        method: "POST",
        data: JSON.stringify({
          user: {
            name: $('#inputName1').val(),
            email: $('#inputEmail1').val()
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

function openUserModal() {
  $('.alert').alert('close');
  $('#userModal').modal({ backdrop: 'static' })
}
function deleteUser(id) {
  console.log('delete: ' + id);
  $.ajax({
    url: "/users/" + id,
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
function searchUser(){
  var userId =  $('#userIDSearch').val();
  if (!Number.isInteger(parseInt(userId)) || parseInt(userId) < 1){
    bootstrap_alert.error('#global-alert', "Invalid User ID: " + userId + '. Must be an integer > 0.');
    return;
  }
  window.location.href = location.origin + '/users/' + userId;
}

function closeUsersModal(){
  window.location.href = location.origin + '/users';
}