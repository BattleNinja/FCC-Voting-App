var express = require('express');
var router = express.Router();
var Vote = require('../models/vote');




router.get('/new', function(req, res) {
    if (!req.user) {
        req.flash('error', 'Login first');
        res.redirect('/users/login');
    } else {
        res.render('new');
    }
});

router.post('/new', function(req, res) {
    var options = [];
    for (var i = 1; i < 5; i++) {
        var option = 'option' + i;
        if (req.body[option]) {
            options.push({
                option: req.body[option],
                number: 0
            })
        }
    }
    var vote = new Vote({
        title: req.body.title,
        options: options
    })
    vote.save(function(err, vote) {
        if (err) throw err;
        console.log(vote)
        req.flash('success_msg', 'Thanks for creating the new vote')
        res.redirect('/');
    })
});

router.get('/', function(req, res) {
    if (!req.user) {
        req.flash('error', 'Login first');
        res.redirect('/users/login');
    } else {
        Vote.renderTitles(function(err, results) {
            if (err) {
                throw err
            } else {
                if (results.length === 0) {
                    res.render('dashboard')
                } else {
                    res.render('dashboard', {
                        results: results
                    });
                    //console.log(results);
                }
            }
        });
    }
});

router.get('/:id([0-9a-z]{24}$)', function(req, res) {
    if (!req.user) {
        req.flash('error', 'Login first');
        res.redirect('/users/login');
    } else {
        Vote.findVoteById(req.params.id, function(err, vote) {
            if (err) {
                throw err
            } else {
                // res.send(vote[0].title);
                res.render('votepage', {
                    vote: vote
                });
                //console.log(vote[0].title)
            }
        });
    }
});

router.post('/:id([0-9a-z]{24}$)', function(req, res) {
    console.log(req.body._id)

    Vote.findNumber(req.body._id, function(err, option) {
        if (err) throw err;
        req.flash('success_msg', 'Thanks for you vote');
        res.redirect('/');
    });
});


router.get('/api/:id([0-9a-z]{24}$)', function(req, res) {
    Vote.findVoteById(req.params.id, function(err, vote) {
        if (err) {
            throw err
        } else {
            // res.send(vote[0].title);
            res.json(vote);
            //console.log(vote[0].title)
        }
    });
});


module.exports = router;
