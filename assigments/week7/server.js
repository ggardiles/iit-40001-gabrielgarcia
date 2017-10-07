// MongoDB
var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
var ObjectId = require('mongodb').ObjectID;
var connection = mongoose.connect('mongodb://localhost', {
  useMongoClient: true
});
mongoose.Promise = require('bluebird');

var handSchema = mongoose.Schema({
  cards: [
    {
      rank: String,
      suit: String
    }
  ]
});

handSchema.plugin(AutoIncrement, { inc_field: 'handId' });
var Hand = mongoose.model('Hand', handSchema);

// ExpressJS
var express = require('express');
var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


/**
 *  GET /Hands/<id>
 */
app.get('/hands/:handId', function (req, res) {
  var handId = req.params.handId;

  // Validation
  if (!handId || handId < 1) {
    res.status(404).json({ error: 'Invalid hand ID: ' + handId });
  }

  Hand.findOne({ handId: handId }, { cards: 1, handId: 1 })
    .populate('cards', "-_id")
    .exec()
    .then(function (hand) {
      res.json({
        id: hand.handId,
        cards: hand.cards
      });
    })
    .catch(function (err) {
      console.error(err);
      res.status(404).json({ error: 'Hand could not be found with id: ' + handId });
    });
});


/**
 *  GET /Hands/<id>/cards
 */
app.get('/hands/:handId/cards', function (req, res) {
  var handId = req.params.handId;

  // Validation
  if (!handId || handId < 1) {
    res.status(404).json({ error: 'Invalid hand ID: ' + handId });
  }

  Hand.findOne({ handId: handId }, { cards: 1 })
    .populate('cards', "-_id")
    .exec()
    .then(function (hand) {
      res.send(hand.cards);
    })
    .catch(function (err) {
      console.error(err);
      res.status(404).json({ error: 'Cards could not be found for handId: ' + handId });
    });
});



/**
 *  POST /Hands
 */
app.post('/hands', function (req, res) {
  var cards = JSON.parse(req.body.cards);

  // Validation
  if (!cards || cards.length != 5) {
    res.status(404).json({ error: 'Invalid number of cards: ' + cards.length + 'should be exactly 5' });
  }

  Hand.create({ cards: cards })
    .then(function (hand) {
      res.json({ id: hand.handId });
    })
    .catch(function (err) {
      res.status(500)
        .send('Server Error: Could not create hand with cards: ' + JSON.stringify(cards));
    });
});


/**
 *  PUT /Hands/<id>
 */
app.put('/hands/:handId', function (req, res) {
  var handId = req.params.handId;
  var cards = JSON.parse(req.body.cards);

  // Validation
  if (!handId || handId < 1) {
    res.status(404).json({ error: 'Invalid hand ID: ' + handId });
  }
  if (cards.length != 5) {
    res.status(404).json({ error: 'Invalid number of cards: ' + cards.length + 'should be exactly 5' });
  }

  Hand.update({ handId: handId }, { $set: { cards: cards } })
    .exec()
    .then(function (hand) {
      res.status(204).send();
    })
    .catch(function (err) {
      res.status(404).json({ error: 'HandID ' + handId + ' could not be updated' });
    });
});

/**
 *  SERVER INITIALIZATION
 */
app.listen(3000, function () {
  console.log('Gabriel Garcia Server on port 3000!');
});
