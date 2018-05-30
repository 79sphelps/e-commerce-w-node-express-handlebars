var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/order');
var Cart = require('../models/cart');

var csrf = require('csurf');
var csrfProtection = csrf();

var passport = require('passport');

router.use(csrfProtection); // tells express to protect all routes with CSRF protection!

var HOST_IP = 'http://192.168.0.32:3000';

router.get(`${HOST_IP}/profile`, isLoggedIn, (req, res, next) => {

  console.log('in profile page...');

  Order.find({user: req.user}, (err, orders) => {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach((order) => {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', { orders: orders });
  });
});

router.get(`${HOST_IP}/logout`, isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect('/');
});

// Use middleware here for grouping! (/user/...)
router.use(`${HOST_IP}/`, notLoggedIn, (req, res, next) => {
  next();
});

router.get(`${HOST_IP}/signup`, (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
})

router.post(`${HOST_IP}/signup`, passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), (req, res, next) => {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

router.get(`${HOST_IP}/signin`, (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post(`${HOST_IP}/signin`, passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), (req, res, next) => {
  if (req.session.oldUrl) {
    console.log('inside...');
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    console.log('other...');
    res.redirect('/user/profile');
  }
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(`/`);
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
      return next();
  }
  res.redirect(`${HOST_IP}/`);
}