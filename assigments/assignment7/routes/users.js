var express = require('express');
var router = express.Router();


/**
 ****************************************
 **  Global objects used as data store **
 **************************************** 
 */
var NEXT_ID = 1;
var users = {}

/** Example of Users Object */
// 1: {
//   name: 'abc',
//     email: 'a@a.com',
//       reminders: [
//         {
//           "title": "Example Title",
//           "description": "Example Description",
//           "created": "2012-04-23T18:25:43.511Z"
//         }
//       ]
// }


/**
 ***********************
 **  Helper functions **
 *********************** 
 */
function addNewUser(user) {
  // Check if user name or email already exists
  checkUserDuplicate(user);

  // Create new entry in users global object and increment next id
  users[NEXT_ID++] = { name: user.name, email: user.email, reminders: [] };
  return NEXT_ID - 1;
}

function addNewReminder(userId, reminder) {
  // Check if user exists
  if (!users[userId]) {
    throw new Error('User ID: ' + userId + ' does not exist');
  }

  // Push it to array and return array length as id
  return users[userId].reminders.push(
    {
      id: users[userId].reminders.length + 1,
      title: reminder.title,
      description: reminder.description,
      created: Date.now(),
      isDeleted: false
    })
}

function checkUserDuplicate(user) {
  for (var id in users) {
    if (users[id].name === user.name) {
      throw new Error('User with name ' + user.name + ' is already in database');
    }
    if (users[id].email === user.email) {
      throw new Error('User with email ' + user.email + ' is already in database');
    }
  }
}

function validateUserObject(user) {
  if (!user.name || !user.email) {
    throw new Error('User name and email must be specified');
  }
  if (typeof user.name !== "string" && !isNaN(user.name)) {
    throw new Error('User name is not a valid string: ' + user.name);
  }
  if (typeof user.email !== "string" && !isNaN(user.email)) {
    throw new Error('User email is not a valid string: ' + user.email);
  }
}

function validateReminderObject(reminder) {
  if (!reminder.title || !reminder.description) {
    throw new Error('reminder title and description must be specified');
  }
  if (typeof reminder.title !== "string" && !isNaN(reminder.title)) {
    throw new Error('reminder title is not a valid string: ' + reminder.title);
  }
  if (typeof reminder.description !== "string" && !isNaN(reminder.description)) {
    throw new Error('reminder description is not a valid string: ' + reminder.description);
  }
}

/**
 ****************
 *****  API *****
 **************** 
 */
/**
 *  GET /<userId>
 */
router.get('/:userId.json', function (req, res) {
  var userId = req.params.userId;

  // Get user
  var user = users[userId];

  // Check if user exists
  if (!user) {
    return res.status(404).json({ error: 'User ID: ' + userId + ' does not exist' });
  }

  res.json({ id: userId, name: user.name, email: user.email })
});


/**
 *  GET /<userId>/reminders
 */
router.get('/:userId/reminders.json', function (req, res) {
  var userId = req.params.userId;

  // Get user
  var user = users[userId];

  // Check if user exists
  if (!user) {
    return res.status(404).json({ error: 'User ID: ' + userId + ' does not exist' });
  }

  // Get reminders for user
  var reminders = user.reminders;

  // Check if user has reminders
  if (reminders.length === 0) {
    return res.status(404).json({ error: 'User ID: ' + userId + ' does not have reminders' });
  }

  // Filter reminders and format response object
  var final_reminders = reminders.filter(function (el) {
    if ('title' in req.query && req.query.title !== el.title) {
      return false;
    };

    return !el.isDeleted
  }).map(function (el) {
    return {
      id: el.id ? el.id : undefined,
      title: el.title,
      description: el.description,
      created: el.created
    }
  });

  // Check if filtered reminders still exist
  if (final_reminders.length === 0) {
    return res.status(404).json({ error: 'User ID: ' + userId + ' does not have reminders' });
  }
  res.json(final_reminders);
});


/**
 *  GET /<userId>/reminders/<reminderId>
 */
router.get('/:userId/reminders/:reminderId.json', function (req, res) {
  var userId = req.params.userId;
  var reminderId = req.params.reminderId;

  // Get user
  var user = users[userId];

  // Check if user exists
  if (!user) {
    return res.status(404).json({ error: 'User ID: ' + userId + ' does not exist' });
  }

  // Get reminders for user
  var reminders = user.reminders;

  // Check if reminder exist and not deleted
  if (reminderId < 1 || reminderId > reminders.length || reminders[reminderId - 1].isDeleted) {
    return res.status(404).json({ error: 'Reminder ID: ' + reminderId + ' does not exist' });
  }

  // Get reminder
  var reminder = reminders[reminderId - 1];

  // Delete non important field from object
  delete reminder.isDeleted;

  res.json(reminder);
});


/**
 *  POST /
 */
router.post('/', function (req, res) {
  var user = req.body.user;

  try {
    // Check user is not duplicate and add it to datastore
    validateUserObject(user);

    // Create user and save created id
    var userId = addNewUser(user);

    res.json({ id: userId });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});


/**
 *  POST /<userId>/reminders
 */
router.post('/:userId/reminders', function (req, res) {
  var userId = req.params.userId;
  var reminder = req.body.reminder;

  // Get user
  var user = users[userId];

  // Check user exists
  if (!user) {
    return res.status(404).json({ error: 'User ID: ' + userId + ' does not exist' });
  }

  try {
    // Validate incoming reminder object
    validateReminderObject(reminder);

  } catch (e) {
    return res.status(404).json({ error: e.message });
  }

  // Create reminder and save created id
  var reminderId = addNewReminder(userId, reminder);

  res.json({ id: reminderId });
});


/**
 *  DELETE /<userId>
 */
router.delete('/:userId', function (req, res) {
  var userId = req.params.userId;

  // Get user
  var user = users[userId];

  // Check user exists
  if (!user) {
    return res.status(404).json({ error: 'User ID: ' + userId + ' does not exist' });
  }

  // Delete user from datastore
  delete users[userId];

  res.status(204).send();
});


/**
 *  DELETE /<userId>/reminders
 */
router.delete('/:userId/reminders', function (req, res) {
  var userId = req.params.userId;

  // Get user
  var user = users[userId];

  // Check user exists
  if (!user) {
    return res.status(404).json({ error: 'User ID: ' + userId + ' does not exist' });
  }

  // Clear out reminders for user
  // users[userId].reminders = [];
  users[userId].reminders = users[userId].reminders.map(function (el) {
    el.isDeleted = true;
    return el;
  });

  res.status(204).send();
});


/**
 *  DELETE /<userId>/reminders/<reminderId>
 */
router.delete('/:userId/reminders/:reminderId', function (req, res) {
  var userId = req.params.userId;
  var reminderId = req.params.reminderId;

  // Get user
  var user = users[userId];

  // Check user exists
  if (!user) {
    return res.status(404).json({ error: 'User ID: ' + userId + ' does not exist' });
  }

  // Get reminders for user
  var reminders = user.reminders;

  // Check reminder is valid and not deleted
  if (reminderId < 1 || reminderId > reminders.length || reminders[reminderId - 1].isDeleted) {
    return res.status(404)
      .json({ error: 'User ID: ' + userId + ' does not have Reminder ID: ' + reminderId });
  }

  // Delete reminder from array of reminders of user
  users[userId].reminders[reminderId - 1].isDeleted = true;

  res.status(204).send();
});


/**
 *******************
 *****  SERVER *****
 ******************* 
 */

/**
*  GET /
*/
router.get('/', function (req, res) {
  /** TODO!!! */
  var users_arr = [];
  for (var id in users) {
    if (users.hasOwnProperty(id)) {
      // Create user object
      var u = users[id];
      u.id = id;

      // Append to users array
      users_arr.push(u)
    }
  }

  // Check if user exists
  if (!users_arr || users_arr.length === 0) {
    return res.render('users', { users: [] });
  }

  res.render('users', { users: users_arr });
});

/**
*  GET /<id>
*/
router.get('/:userId', function (req, res) {
  var userId = req.params.userId;

  // Get user
  var user = users[userId];

  // Check if user exists
  if (!user) {
    return res.render('users', { users: [] });
  }

  res.render('users', { users: [user] });
});
/**
*  GET /<id>
*/
router.get('/:userId/reminders', function (req, res) {
  var userId = req.params.userId;

  // Get user
  var user = users[userId];

  // Check if user exists
  if (!user) {
    return res.render('servererror', { error: 'User ID: ' + userId + ' does not exist' });
  }

  // Get reminders for user
  var reminders = user.reminders;

  // Check if user has reminders
  if (reminders.length === 0) {
    return res.render('user', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        reminders: []
      }
    });
  }

  // Filter reminders and format response object
  var final_reminders = reminders.filter(function (el) {
    if ('title' in req.query && req.query.title !== el.title) {
      return false;
    };

    return !el.isDeleted
  }).map(function (el) {
    return {
      id: el.id ? el.id : undefined,
      title: el.title,
      description: el.description,
      created: el.created
    }
  });


  return res.render('user', {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      reminders: final_reminders
    }
  });
});



module.exports = router;
