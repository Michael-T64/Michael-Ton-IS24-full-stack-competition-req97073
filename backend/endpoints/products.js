const express = require('express');
const {
    getAllProducts,
    getSingleProduct,
    createProduct,
    deleteProduct,
    updateProduct,
} = require('../controllers/productsController');

const router = express.Router();

// GET all products
router.get('/', getAllProducts);

//GET a single product
router.get('/:productId', getSingleProduct);

//POST a new product
router.post('/', createProduct);

//DELETE product
router.delete('/:productId', deleteProduct);

//UPDATE product
router.put('/:productId', updateProduct);

module.exports = router;
