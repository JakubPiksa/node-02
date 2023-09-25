const jwt = require('jsonwebtoken');
const User = require('../models/users');

require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const authenticateToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Not authorized' }), console.log(1);
    }

    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    const user = await User.findOne({ _id: decoded.userId, token });

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' }), console.log(2);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error during authentication:', error);
    return res.status(401).json({ message: 'Not authorized' });
  }
};


const logOut = async (req, res, next) => {
  const userId = req.user._id;

  try {
    await User.findByIdAndUpdate(userId, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

module.exports = {
  authenticateToken,
  logOut,
  getCurrentUser
};
