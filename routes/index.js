var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Address book' });
});

router.get('/register', function(req, res) {
  res.render('register_form');
});

router.get('/add_contact', function(req, res) {
    res.render('add_contact');
});

module.exports = router;
