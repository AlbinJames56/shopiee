var express = require('express');
//const {render}=require('../app')
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const products = await productHelpers.getAllProducts();
    res.render('admin/view-products', { products, admin: true });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/add-products',(req,res)=>{
  res.render("admin/add-products");
});
router.post('/add-product', (req, res) => {
  // console.log(req.body);
  // console.log(req.files.image);

  productHelpers.addProduct(req.body, (id) => {
      if (id) {
          // Product added successfully, redirect to the add-products page
          let image=req.files.image
          console.log(id)
          image.mv('./public/product-images/'+id+'.jpg', function(err) {
            if (err) return res.status(500).send(err);
          else res.redirect('/admin/add-products');
      })} else {
          // Product addition failed, render the add-products page with an error message
          res.render('admin/add-products', { error: 'Failed to add product' });
      }
  });
});
router.get('/delete-product/:id',(req,res)=>{
  let prodId=req.params.id;
  if (prodId.length !== 24) {
    return res.status(400).send('Invalid product ID');
}
productHelpers.deleteProduct(prodId).then((response) => {
    res.redirect('/admin/');
}).catch((error) => {
    console.error('Error deleting product:', error);
    res.redirect('/admin/');
});
})
 
module.exports = router;
