const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Dodane - import dotenv
const usersRouter = require('./routes/api/users'); // Dodane - import routera dla użytkowników
const contactsRouter = require('./routes/api/contacts');

dotenv.config(); // Dodane - konfiguracja dotenv

const app = express();

// Middleware
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// API routes
app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter); // Dodane - obsługa tras dla użytkowników

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
