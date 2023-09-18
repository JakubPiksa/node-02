const mongoose = require('mongoose');
require('dotenv').config(); 

const dbURI = process.env.uriDb;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Błąd połączenia z bazą danych:'));
db.once('open', () => {
  console.log('Połączono z bazą danych MongoDB!');
});

module.exports = db;