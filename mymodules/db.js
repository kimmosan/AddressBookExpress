var mongoose = require('mongoose');
var uriString = 'mongodb://localhost/addressbook';

mongoose.connect(uriString, function (err, res) {
    if(err) {
        console.log("Connection to: " + uriString + " failed!\n" + err);
    }
    else {
        console.log("Connected to: " + uriString);
    }
});