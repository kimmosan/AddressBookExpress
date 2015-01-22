var express = require('express');
var path = require('path'); 
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./mymodules/db.js');
var multer  = require('multer')

var routes = require('./routes/index');

var app = express();

app.use(session({cookie:{path:'/',httpOnly:true,maxAge:null}, secret:'g54gw5gwetgh89etgrtg78we5tg89etegh89666', resave:false, saveUninitialized:true}));

app.use(multer({ dest: './photos/'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Make routes here
app.use('/', routes);
app.use('/register', routes);
app.use('/login', db.login);
app.use('/register_user', db.registerUser);
app.use('/names', db.loadNames);
app.use('/list', db.listUsers);
app.use('/save_contact', db.addContact);
app.use('/add_contact', routes);
app.use('/contact', db.showContact);
app.use('/get_image', routes);
app.use('/delete_contact', db.deleteContact);
app.use('/logout', db.logout);
app.use('/edit_contact', db.editContact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
