const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/users');
const { authenticateToken } = require('../../middleware/authMiddleware');
require('dotenv').config();
const multer = require('multer');
const jimp = require('jimp');



const secretKey = process.env.SECRET_KEY;




// Endpoint do rejestracji użytkownika
router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });  
    const user = new User({
      email,
      password: hashedPassword,
      subscription: 'starter',
      avatarURL,  
    });
    
    await user.save();

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
      message: 'User registered successfully'
    });
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
router.get('/logout', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Endpoint do pobrania danych bieżącego użytkownika
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch user data', error: error.message });
  }
});


router.patch('/avatars', authenticateToken, avatarUpload.single('avatar'), async (req, res, next) => {
  try {
    const user = req.user;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatar = await jimp.read(req.file.path);
    await avatar.resize(250, 250); 
    const avatarFilename = `${user._id}.jpg`; 


    await avatar.writeAsync(`public/avatars/${avatarFilename}`);

    user.avatarURL = `/avatars/${avatarFilename}`;
    await user.save();


    await jimp.read(req.file.path).then(image => image.remove());

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
});


const avatarUpload = multer({
  dest: 'tmp/',
  limits: {
    fileSize: 1024 * 1024 * 5, 
  },
});

module.exports = router;