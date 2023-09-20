const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/users');
const { authenticateToken, logOut, getCurrentUser } = require('../../middleware/authMiddleware');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

// Endpoint do rejestracji użytkownika
router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Endpoint do logowania użytkownika
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    user.token = token;
    await user.save();

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Endpoint do wylogowywania użytkownika
router.get('/logout', authenticateToken, logOut);

// Endpoint do pobrania danych bieżącego użytkownika
router.get('/current', authenticateToken, getCurrentUser);

module.exports = router;
