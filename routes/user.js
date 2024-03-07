var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')

/* GET home page. */
router.get('/', async (req, res,next) => {
    try {
      const products = await productHelpers.getAllProducts();
      res.render('user/view-products', { products});
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
module.exports = router;
