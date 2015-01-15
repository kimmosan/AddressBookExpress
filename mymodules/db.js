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

var usernameSchema = new mongoose.Schema({
    username:{type:String, unique:true},
    password:String,
    email:String
});

var addressbookSchema = new mongoose.Schema({
    user:String,
    name:String,
    address:String,
    phonenumber:String
});

var usernameModel = mongoose.model("UsernameM", usernameSchema);
var addressbookModel = mongoose.model("AddressbookM", addressbookSchema);

exports.registerUser = function(req, res) {
    console.log(req.body);
    
    var temp = new usernameModel({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email
    });
    
    temp.save(function(err){
        if(err){
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
}

exports.login = function(req, res) {
    usernameModel.find({username: req.body.username}, function(err, data){
        console.log(data);
        if(err || data[0] == null){
            console.log("Erroria pukkaa");
            res.redirect('/');
        }
        else {
            if(req.body.password === data[0].password) {
                req.session.userLoggedIn = true;
                req.session.username = data[0].username;
                console.log("User logged in");
                res.redirect('/names'); 
            }
            else {
                console.log("Wrong password");
                res.redirect('/');
            }
        }
    });
}

exports.loadNames = function(req, res) {
    console.log("loadNames function called");
    if (req.session.userLoggedIn == true){
        addressbookModel.find({user:req.session.username},function(err, data){
            if (err) {
                console.log(err);
                res.redirect('/');
            }
            else {
                console.log("Data from addressbook");
                console.log(data);
                res.render('names', {contacts:data, user:req.session.username});
            }
        });
    }
    else {
        res.redirect('/');
    }
}

exports.addContact = function(req, res) {
    console.log(req.session.username);
    var temp = new addressbookModel({
        user:req.session.username,
        name: req.body.name,
        address:req.body.address,
        phonenumber:req.body.phonenumber
    });
    
    temp.save(function(err){
        if(err){
            console.log(err);
        }
        else {
            console.log("Saved");
            res.redirect('/names');
        }       
    });
}

// Print all users to console
exports.listUsers = function(req, res) {
    
    console.log("All users:\n-------");
    usernameModel.find(function(err, data){
        console.log(data);
        res.redirect('/');
    });
    
    console.log("All addresses:\n-------");
    addressbookModel.find(function(err, data){
        console.log(data);
        res.redirect('/');
    });
        
}

exports.logout = function(req, res) {
    req.session.destroy(function(err) {

    });
}