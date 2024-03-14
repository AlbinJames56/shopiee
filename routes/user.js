var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
const userHelpers=require("../helpers/user-helpers")

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
} 
/* GET home page. */
router.get('/', async (req, res,next) => {
    try {
      let user=req.session.user;
      const products = await productHelpers.getAllProducts();
      res.render('user/view-products', { products,user});
      console.log(user);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.get('/login',(req,res)=>{
    if(req.session.loggedIn){
      res.redirect('/')
    }else{

       res.render('user/login',{"loginErr":req.session.loginErr});
       req.session.loginErr=false;
    }
   
  });
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true;
      req.session.user=response.user //creating cookie and session
      res.redirect('/')
    }else{
      req.session.loginErr="Invalid username or password";
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
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
})
router.get('/cart',verifyLogin,(req,res)=>{
  res.render("user/cart");
})     
 
module.exports = router;
