const User = require('../models/User');

// eslint-disable-next-line consistent-return
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.w_auth;
    const user = await User.findByToken(token);
    if (!user) {
      return res.status(404).json({ isAuth: false });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    console.error(new Error(err));
    throw err;
  }
};

module.exports = auth;
