const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const usersRouter = require('./routes/api/users');
const contactsRouter = require('./routes/api/contacts');
const morgan = require('morgan');

dotenv.config();

const app = express();

app.use(morgan('dev'));

app.use(express.json());

const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl, {
  dbName: "db-contacts",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {

  console.log('Connected to MongoDB');
});

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on a port ${PORT}`);
});
