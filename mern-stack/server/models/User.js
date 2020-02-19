/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const TOKEN_EXPIRE_TIME = 3600; // unit: seconds
const PRIVATE_KEY = 'secret';
const PUBLIC_KEY = 'secret';

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 8,
  },
  name: {
    type: String,
    maxlength: 50,
  },
  image: {
    type: String,
  },
  token: {
    type: String,
  },
  tokenExpire: {
    type: Number,
  },
});

userSchema.pre('save', async (next) => {
  const user = this;
  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSaltSync(SALT_WORK_FACTOR);
      const hash = await bcrypt.hashSync(user.password, salt);
      user.password = hash;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = (password, next) => {
  try {
    const user = this;
    const isMatched = bcrypt.compareSync(password, user.password);
    next(null, isMatched);
  } catch (err) {
    next(err);
  }
};
userSchema.methods.generateToken = (next) => {
  const user = this;
  // eslint-disable-next-line no-underscore-dangle
  user.token = jwt.sign(user._id.toHexString(), PRIVATE_KEY);
  user.tokenExpire = moment().add(TOKEN_EXPIRE_TIME, 'seconds').valueOf();
  user.save((err, data) => {
    if (err) {
      return next(err);
    }
    next(null, data);
  });
};

// eslint-disable-next-line arrow-body-style
userSchema.statics.findByToken = (token) => {
  return new Promise((resolve, reject) => {
    const user = this;
    jwt.verify(token, PUBLIC_KEY, (err, decode) => {
      user.findOne({
        _id: decode,
        token,
      // eslint-disable-next-line no-shadow
      }, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
