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

// GET IMAGE
// - - - - -
router.get('/get_image', function(req, res){
    console.log("Get image");
    var options = {
        root: __dirname + "/../photos/"    
    };
    console.log("Sending photo file: " + options.root);
    res.sendFile(req.query.photoname, options);
});

module.exports = router;
