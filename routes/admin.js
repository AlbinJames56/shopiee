var express = require('express');
//const {render}=require('../app')
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  let products=[{
    name:"Iphone",
    cateory:"Smartphone",
    price:"129000",
    image:"https://rukminim2.flixcart.com/image/850/1000/l0igvww0/mobile/c/j/j/-original-imagca5hhzsgpycf.jpeg?q=90&crop=false"
  },{
    name:"S24 Ultra",
    cateory:"Smartphone",
    price:"139000",
    image:"https://i.gadgets360cdn.com/products/large/galaxy-s24-ultra-797x800-1705519965.jpg"
  },{
    name:"S24 Ultra",
    cateory:"Smartphone",
    price:"139000",
    image:"https://i.gadgets360cdn.com/products/large/galaxy-s24-ultra-797x800-1705519965.jpg"
  },{
    name:"Iphone",
    cateory:"Smartphone",
    price:"129000",
    image:"https://rukminim2.flixcart.com/image/850/1000/l0igvww0/mobile/c/j/j/-original-imagca5hhzsgpycf.jpeg?q=90&crop=false"
  },{
    name:"S24 Ultra",
    cateory:"Smartphone",
    price:"139000",
    image:"https://i.gadgets360cdn.com/products/large/galaxy-s24-ultra-797x800-1705519965.jpg"
  },{
    name:"S24 Ultra",
    cateory:"Smartphone",
    price:"139000",
    image:"https://i.gadgets360cdn.com/products/large/galaxy-s24-ultra-797x800-1705519965.jpg"
  }]
  res.render( 'admin/view-products',{ products,admin:true});
  
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
 
module.exports = router;
