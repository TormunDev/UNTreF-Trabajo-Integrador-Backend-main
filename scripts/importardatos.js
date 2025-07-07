const mongoose = require('mongoose');
const Product = require('../models/product');
const data = require('../data/computacion.json');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(data);
    console.log('Datos importados');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });