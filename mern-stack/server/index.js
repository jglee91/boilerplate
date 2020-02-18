const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('common'));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.listen(port, () => console.log(`Listening on port ${port}`));
