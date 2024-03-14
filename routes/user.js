var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
const userHelpers=require("../helpers/user-helpers")

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
  router.get('/login',(req,res)=>{
    res.render('user/login');
  });
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user //creating cookie and session
      res.redirect('/')
    }else{
      res.redirect('/login')
    }
  }).catch((error) => {
    console.error('Error during login:', error);
    res.redirect('/login');
  });
});
  




  router.get('/signup',(req,res)=>{
    res.render('user/signup');
  })
  //adding user to database
  router.post('/signup',async (req,res)=> {
    let newUser={...req.body};
    
    if(!newUser.name || !newUser.password){
        return res.json({message:"Please fill out all fields"})
    }else{
      try {
      const insertedId = await userHelpers.doSignup(newUser);
      console.log('Inserted user ID:', insertedId);
      res.redirect('/login'); // Redirect to login page after successful signup
      } catch (error) {
      console.error('Error signing up user:', error);
      res.status(500).send('Internal Server Error');
     }
    }
  });

     
module.exports = router;
