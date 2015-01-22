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

var contactsSchema = new mongoose.Schema({
    user:String,
    name:String,
    address:String,
    phonenumber:String,
    birthday:String,
    photo:String
});

var usernameModel = mongoose.model("UsernameMod", usernameSchema);
var contactsModel = mongoose.model("ContactsMod", contactsSchema);

// REGISTER NEW USER
// - - - - - - - - -
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

// LOGIN PROCESS
// - - - - - - -
exports.login = function(req, res) {
    
    //Check if the username is found from database
    usernameModel.find({username: req.body.username}, function(err, data){
        console.log(data);
        if(err || data[0] == null){
            console.log("Login erroria pukkaa");
            res.redirect('/');
        }
        else {
            
            //Username found, check if password is correct
            if(req.body.password === data[0].password) {
                req.session.userLoggedIn = true;
                req.session.username = data[0].username;
                console.log("User " + req.session.username + " logged in");
                res.redirect('/names'); 
            }
            else {
                console.log("Wrong password");
                res.redirect('/');
            }
        }
    });
}

// LOAD CONTACTS
// - - - - - - -
exports.loadNames = function(req, res) {
    console.log("loadNames function called");
    if (req.session.userLoggedIn == true){
        contactsModel.find({user:req.session.username},function(err, data){
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

// SHOW CONTACT
// - - - - - -
exports.showContact = function(req, res) {
    console.log("showContact called with contact name: " + req.query.id);
    if (req.session.userLoggedIn == true){
        contactsModel.findById(req.query.id,function(err, data){
            if (err) {
                console.log(err);
                res.redirect('/');
            }
            else {
                console.log("Data from addressbook");
                console.log(data);
                res.render('contact', data);
            }
        });
    }
    else {
        res.redirect('/');
    }    
    
}

// EDIT CONTACT
// - - - - - - 
exports.editContact = function(req, res) {
    console.log(req.session.username + " is editing contact " + req.query._id);
    if (req.session.userLoggedIn == true){
        contactsModel.findById(req.query.id,function(err, data){
            if (err) {
                console.log(err);
                res.redirect('/names');
            }
            else {
                console.log("Data from addressbook");
                console.log(data);
                res.render('add_contact', data);
            }   
        });
    }
}

// ADD NEW CONTACT
// - - - - - - - -
exports.addContact = function(req, res) {
    console.log(req.session.username + " is adding new contact");
    
    if(req.body.id) {
        console.log("ID found --> editing contact");
        contactsModel.findById(req.body.id, function(err,data){
            if(err){
                console.log(err);
            }
            else {
                
            }
        });
    }
    else{
        
        if(req.files.photo) {
            var photo = req.files.photo.name;    
        }
        else {
            var photo = "nophoto.jpg";
        }

        var temp = new contactsModel({
            user:req.session.username,
            name: req.body.name,
            address:req.body.address,
            phonenumber:req.body.phonenumber,
            birthday: req.body.birthday,
            photo: photo
        });

        temp.save(function(err){
            if(err){
                console.log(err);
            }
            else {
                console.log("Contact saved to database");
                res.redirect('/names');
            }       
        });
    }
}

// DELETE CONTACT
// - - - - - - -
exports.deleteContact = function(req, res){
    console.log("Trying to delete contact " + req.query.id);
    contactsModel.findById(req.query.id, function(err, data){
        if(err) {
            console.log(err);
            res.redirect("/names");
        }
        else {
            console.log("Contact found, now remove");
            data.remove();
            res.redirect("/names");
        }
    });
}

// Print all users to console
exports.listUsers = function(req, res) {
    
    console.log("All users:\n-------");
    usernameModel.find(function(err, data){
        console.log(data);
    });
    
    console.log("All addresses:\n-------");
    contactsModel.find(function(err, data){
        console.log(data);
    });
    res.redirect('/');
        
}

// LOGOUT
exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}