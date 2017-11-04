var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landpage', { title: 'Express' });
});

router.post('/error', function(req, res, next) {
  var error = req.body.error;
  res.render('servererror', { error: error });
});

module.exports = router;
