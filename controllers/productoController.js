const Product = require('../models/product');

// GET /productos
exports.getAllProducts = async (req, res) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error(error); // Esto debe estar
    res.status(500).json({ mensaje: 'Error al obtener los productos' });
  }
};

// GET /productos/:codigo
exports.getProductByCodigo = async (req, res) => {
  try {
    const codigo = parseInt(req.params.codigo);
    const producto = await Product.findOne({ codigo });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el producto' });
  }
};

// POST /productos
exports.createProduct = async (req, res) => {
  try {
    const { codigo, nombre, precio, categoria } = req.body;
    if (!codigo || !nombre || !precio || !categoria) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }
    const existe = await Product.findOne({ codigo });
    if (existe) {
      return res.status(400).json({ mensaje: 'El código ya existe' });
    }
    const nuevoProducto = new Product({ codigo, nombre, precio, categoria });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el producto', error });
  }
};

// PUT /productos/:codigo
exports.updateProduct = async (req, res) => {
  try {
    const codigo = parseInt(req.params.codigo);
    const updates = req.body;
    const productoActualizado = await Product.findOneAndUpdate(
      { codigo },
      updates,
      { new: true }
    );
    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el producto', error });
  }
};

// DELETE /productos/:codigo
exports.deleteProduct = async (req, res) => {
  try {
    const codigo = parseInt(req.params.codigo);
    const productoEliminado = await Product.findOneAndDelete({ codigo });
    if (!productoEliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar el producto', error });
  }
};

// ENDPOINTS ADICIONALES
exports.buscarProductos = async (req, res) => {
  try {
    const termino = req.query.q;
    if (!termino) {
      return res.status(400).json({ mensaje: 'Falta el parámetro de búsqueda (q)' });
    }
    console.log('Buscando productos con:', termino);
    const productos = await Product.find({
      nombre: { $regex: termino, $options: 'i' }
    });
    res.status(200).json(productos);
  } catch (error) {
    console.error(error); // Esto es clave para ver el error real
    res.status(500).json({ mensaje: 'Error al buscar el producto' });
  }
};

exports.productosPorCategoria = async (req, res) => {
  try {
    const categoria = req.params.nombre;
    const productos = await Product.find({ categoria: categoria });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al filtrar por categoría', error });
  }
};

exports.productosPorPrecio = async (req, res) => {
  try {
    const [min, max] = req.params.rango.split('-').map(Number);
    if (isNaN(min) || isNaN(max)) {
      return res.status(400).json({ mensaje: 'Parámetros de precio inválidos' });
    }
    const productos = await Product.find({ precio: { $gte: min, $lte: max } });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al filtrar por precio', error });
  }
};

exports.crearProductosMasivo = async (req, res) => {
  try {
    const productos = req.body;
    if (!Array.isArray(productos)) {
      return res.status(400).json({ mensaje: 'El cuerpo debe ser un array de productos' });
    }
    const productosValidos = [];
    for (const prod of productos) {
      if (prod.codigo && prod.nombre && prod.precio && prod.categoria) {
        const existe = await Product.findOne({ codigo: prod.codigo });
        if (!existe) productosValidos.push(prod);
      }
    }
    if (productosValidos.length === 0) {
      return res.status(400).json({ mensaje: 'No hay productos válidos para agregar' });
    }
    const insertados = await Product.insertMany(productosValidos);
    res.status(201).json(insertados);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error en carga masiva', error });
  }
};