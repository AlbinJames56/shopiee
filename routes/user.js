var express = require("express");
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};
/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    let user = req.session.user;
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    const products = await productHelpers.getAllProducts();
    res.render("user/view-products", { products, user, cartCount });
    // console.log(user);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});
router.post("/login", (req, res) => {
  userHelpers
    .doLogin(req.body)
    .then((response) => {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user; //creating cookie and session
        res.redirect("/");
      } else {
        req.session.loginErr = "Invalid username or password";
        res.redirect("/login");
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      res.redirect("/login");
    });
});

router.get("/signup", (req, res) => {
  res.render("user/signup");
});
//adding user to database
router.post("/signup", async (req, res) => {
  let newUser = { ...req.body };

  if (!newUser.name || !newUser.password) {
    return res.json({ message: "Please fill out all fields" });
  } else {
    try {
      const insertedId = await userHelpers.doSignup(newUser);
      // console.log('Inserted user ID:', insertedId);
      req.session.loggedIn = true;
      req.session.user = response;
      res.redirect("/ "); // Redirect to login page after successful signup
    } catch (error) {
      console.error("Error signing up user:", error);
      res.status(500).send("Internal Server Error");
    }
  }
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
router.get("/cart", verifyLogin, async (req, res) => {
  try {
    let products = await userHelpers.getCartProducts(req.session.user._id);
    //console.log("cart", products);
    res.render("user/cart", { products, user: req.session.user }); // Pass products to the view
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).send("Internal Server Error");
  }
});
//carT
router.get("/add-to-cart/:id", async (req, res) => {
  try {
    await userHelpers.addToCart(req.params.id, req.session.user._id);
    res.json({ status: true });
  } catch (err) {
    console.log(err);
  }
});
router.post("/change-product-quantity", (req, res, next) => {
  // console.log(req.body);
  userHelpers.changeProductQuantity(req.body).then((response) => {
    res.json(response);
  });
});

module.exports = router;
