const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const dbURI = process.env.uriDb;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

console.log('URI from .env:', dbURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Błąd połączenia z bazą danych:'));
db.once('open', () => {
  console.log('Połączono z bazą danych MongoDB!');
});

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());


const contactRouter = require('./routes/api/contacts');
app.use('/api/contacts', contactRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
