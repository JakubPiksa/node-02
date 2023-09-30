const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/users');
const { authenticateToken } = require('../../middleware/authMiddleware');
require('dotenv').config();
const multer = require('multer');
const jimp = require('jimp');

const Mailer = require("../../mailConfig");

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



const path = require("path");
const fs = require("fs").promises;
const uploadDir = path.join(process.cwd(), "tmp")  

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
})

  const avatarUpload = multer({ storage: storage });
  

//Endpoint do aktualizacji avatara

router.patch('/avatars', authenticateToken, avatarUpload.single('avatar'), async (req, res, next) => {
  const { path: temporaryName, originalname } = req.file;
  const { user } = req;
  const fileName = path.join(uploadDir, originalname);
  const avatarFilename = `public/avatars/${user._id}.jpg`;

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploded" })
  }

  

  try {
    await fs.rename(temporaryName, fileName);
    const avatarPicture = await jimp.read(fileName);
    avatarPicture.resize(250, 250).write(avatarFilename);
    user.avatarURL = avatarFilename;
    await user.save();
    await fs.unlink(fileName);
    const { avatarURL } = user;

    return res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(temporaryName);
    next(error);
  }
});



// Endsroint do weryfikacji 

router.get('/users/verify/:verificationToken', async (req, res) => {
  const { verificationToken } = req.params;  

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      
      return res.status(404).json({ message: 'User not found' });
    }

    // Znaleziono użytkownika, aktualizuj pola verificationToken i verify
    user.verificationToken = null;
    user.verify = true;
    await user.save();

    // Wysłanie e-maila weryfikacyjnego
    const email = user.email;
    const token = generateVerificationToken(); 

    Mailer.sendVerificationEmail(email, token);

    return res.status(200).json({ message: 'Verification successful' });
  } catch (error) {

    return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;