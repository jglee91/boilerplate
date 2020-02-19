const { Router } = require('express');
const User = require('../models/User');
const auth = require('../middlewares/auth');

const router = Router();

router.get('/auth', auth, (req, res) => {
  res.json({
    // eslint-disable-next-line no-underscore-dangle
    _id: req.user._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    image: req.user.image,
  });
});

router.post('/register', (req, res) => {

});

router.post('/login', (req, res) => {

});

router.get('/logout', (req, res) => {

});

module.exports = router;
