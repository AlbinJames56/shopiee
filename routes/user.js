var express = require('express');
var router = express.Router();

/* GET home page. */
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
  res.render('index', { products});
});
  
module.exports = router;
