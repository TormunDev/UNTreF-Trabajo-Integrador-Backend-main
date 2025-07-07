const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  codigo: { type: Number, unique: true, required: true },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: [{ type: String, required: true }]
});

module.exports = mongoose.model('Product', productSchema);