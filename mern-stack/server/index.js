const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const middlewares = require('./middlewares');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// settings
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use('/api/users', require('./routes/users'));

// middlewares
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}`));
