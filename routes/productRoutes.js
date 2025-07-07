const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/productos', productoController.getAllProducts);
router.get('/productos/:codigo', productoController.getProductByCodigo);
router.post('/productos', productoController.createProduct);
router.put('/productos/:codigo', productoController.updateProduct);
router.delete('/productos/:codigo', productoController.deleteProduct);

router.get('/productos/buscar', productoController.buscarProductos);
router.get('/productos/categoria/:nombre', productoController.productosPorCategoria);
router.get('/productos/precio/:rango', productoController.productosPorPrecio);
router.post('/productos/masivo', productoController.crearProductosMasivo);

module.exports = router;