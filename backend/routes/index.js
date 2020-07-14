var express = require('express');
var router = express.Router();

var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('I have received your GET@index.js');
});

router.post('/',function (req, res, next) {
  res.send('I have received your POST@index.js:' + req.body);
});

module.exports = router;
