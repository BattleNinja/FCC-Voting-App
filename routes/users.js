var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/register', function(req, res) {
    res.render('register')
});
router.get('/login', function(req, res) {
    res.render('login')
});
router.post('/register', function(req, res) {
    //check validation
    req.checkBody('name', 'Name can not be empty').notEmpty();
    req.checkBody('username', 'Name can not be empty').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('password', 'Password is shorter than 4 characters').isLength({
        min: 4
    });
    req.checkBody('password', 'Password not match').equals(req.body.password2);
    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors
        })
    } else {
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        User.createUser(user, function(err, newuser) {
            if (err) throw err;
        });
        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/users/login');

    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/');
    });

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success_msg','See you');
  // req.flash('success_msg', 'See you');

  res.redirect('/users/login');
});



module.exports = router;
