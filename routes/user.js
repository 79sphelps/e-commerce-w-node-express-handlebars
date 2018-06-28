'use strict';

const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart');

const csrf = require('csurf');
const csrfProtection = csrf();

const passport = require('passport');

router.use(csrfProtection); // tells express to protect all routes with CSRF protection!

const HOST_IP = 'http://192.168.0.32:3000';

router.get(`${HOST_IP}/profile`, isLoggedIn, (req, res, next) => {
  Order.find({user: req.user}, (err, orders) => {
    if (err) {
      return res.write('Error!');
    }
    let cart;
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
  let messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
})

router.post(`${HOST_IP}/signup`, passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), (req, res, next) => {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

router.get(`${HOST_IP}/signin`, (req, res, next) => {
  let messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post(`${HOST_IP}/signin`, passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), (req, res, next) => {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
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