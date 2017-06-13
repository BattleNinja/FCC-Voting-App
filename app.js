var express = require('express');
var path = require('path');
var hbs = require('express-handlebars');
var router = require('./routes/index');
var users = require('./routes/users')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
mongoose.connect('mongodb://localhost/loginapp');
mongoose.Promise = global.Promise;
var db = mongoose.connection;

var app = express();
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout'
}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(session({
    secret: 'uahsdskuvsbdfuvbufsbvuksdbvysurgeiyagouy',
    resave: false,
    saveUninitialized: true,
    maxAge: 60000
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.use('/', router);
app.use('/users', users);

var server = app.listen(3000, function() {
    console.log('server is listening on server: 3000');
});
