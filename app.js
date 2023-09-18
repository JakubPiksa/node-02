const contactRouter = require('./routes/api/contacts');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();


const dbUrl = process.env.uriDb;

mongoose.connect(dbUrl, {
  dbName: "db-contacts",
  // collection: "contacts2",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Błąd połączenia z bazą danych:'));
db.once('open', () => {
  console.log('Połączono z bazą danych MongoDB!');
});

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());


app.use('/api/contacts', contactRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

console.log(dbUrl)

const runServer = async () => {
  try {
    const connection = await mongoose.connect(dbUrl);
    console.log('Database connection successful');
    app.listen(3000, () => {
      console.log('Server running. Use our API on port: 3000');
     });
  } catch (error) {
    console.log('Cannot connect to MongoDB');
    console.error(error);
    process.exit(1);
  }
};

runServer();


module.exports = app;
