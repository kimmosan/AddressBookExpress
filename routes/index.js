var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if (req.session.userLoggedIn == true){
        res.redirect('/names');
    }
    else {
        var loginError = req.session.loginError;
        req.session.loginError = null;
        res.render('index', { title: 'Address book', errorText: loginError });
    }
});

router.get('/register', function(req, res) {
    res.render('register_form');
});

router.get('/add_contact', function(req, res) {
    res.render('add_contact');
});

router.get('/email', function(req, res) {
    console.log("Routing to /email with address " + req.query.to);
    res.render('email', { to: req.query.to });
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
