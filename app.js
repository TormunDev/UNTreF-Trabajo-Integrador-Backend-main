const express = require('express');
const connectDB = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const app = express();

connectDB();
app.use(express.json());
app.use('/api', productRoutes);

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});

module.exports = app;