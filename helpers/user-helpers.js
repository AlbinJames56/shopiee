const db = require("../config/connection");
const { connectToDatabase } = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt");
const { log } = require("handlebars");
var { ObjectId } = require("mongodb");
const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "rzp_test_QRxsVv0c0u81qM",
  key_secret: "oH6W8oBNSpxq0dzUFV80qF78",
});

module.exports = {
  doSignup: async (userData) => {
    try {
      userData.password = await bcrypt.hash(userData.password, 8); //Enc.pass
      const database = await db.connectToDatabase();
      const data = await database
        .collection(collection.USER_COLLECTION)
        .insertOne(userData);
      console.log("user added successfully:", data);
      const insertedId = data.insertedId.toString(); // Convert ObjectId to string
      console.log("password:", userData.password);
      return insertedId;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },
  doLogin: async (userData) => {
    try {
      const database = await db.connectToDatabase();
      const user = await database
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        const status = await bcrypt.compare(userData.password, user.password);
        if (status) {
          console.log("Login success");
          return { user: user, status: true };
        } else {
          console.log("Invalid Password");
          return { status: false };
        }
      } else {
        console.log("User not found");
        return { status: false };
      }
    } catch (error) {
      console.error("Error finding user:", error);
    }
  },
  addToCart: async (prodId, userId, res) => {
    try {
      const database = await connectToDatabase();
      let prodObj = {
        item: new ObjectId(prodId),
        quantity: 1,
      };
      const userCart = await database
        .collection(collection.CART_COLLECTION)
        .findOne({ user: new ObjectId(userId) });
      // console.log('User cart:', userCart);
      if (userCart) {
        // Logic for adding product to existing cart
        let prodExist = userCart.product.findIndex(
          (product) => product.item == prodId
        );
        //console.log(prodExist);
        if (prodExist != -1) {
          await database.collection(collection.CART_COLLECTION).updateOne(
            {
              user: new ObjectId(userId),
              "product.item": new ObjectId(prodId),
            },
            {
              $inc: { "product.$.quantity": 1 },
            }
          );
          //console.log("Product quantity updated in cart");
          
        } else {
          await database
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: new ObjectId(userId) },
              { $push: { product: prodObj } }
            );

          //console.log("Product added to existing cart");
        
        }
      } else {
        // Create a new cart for the user
        let cartObj = {
          user: new ObjectId(userId),
          product: [prodObj],
        };
        console.log("New cart object:", cartObj);
        await database
          .collection(collection.CART_COLLECTION)
          .insertOne(cartObj);
        // console.log('Cart inserted successfully');
        
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw error; // Throw the error to be caught by the caller
    }
  },
  getCartProducts: async (userId) => {
    try {
      const database = await connectToDatabase();
      let cartItems = await database
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: new ObjectId(userId) },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
              quantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      // console.log(cartItems[0].product );
      return cartItems;
    } catch (err) {
      console.error("Error showing the cart:", err);
      throw err;
    }
  },
  getCartCount: async (userId) => {
    try {
      const database = await db.connectToDatabase();
      let count = null;
      let cart = await database
        .collection(collection.CART_COLLECTION)
        .findOne({ user: new ObjectId(userId) });

      if (cart) {
        count = cart.product.length;
      }
      return count;
    } catch (error) {
      console.error("Error finding user:", error);
    }
  },
  changeProductQuantity: async (details) => {
    try {
      details.count = parseInt(details.count);
      details.quantity = parseInt(details.quantity);
      if (details.count == -1 && details.quantity == 1) {
        const database = await db.connectToDatabase();
        await database.collection(collection.CART_COLLECTION).updateOne(
          { _id: new ObjectId(details.cart) },
          {
            $pull: { product: { item: new ObjectId(details.product) } },
          }
        );
        return { removeProduct: true };
      } else {
        const database = await db.connectToDatabase();
        await database.collection(collection.CART_COLLECTION).updateOne(
          {
            _id: new ObjectId(details.cart),
            "product.item": new ObjectId(details.product),
          },
          {
            $inc: { "product.$.quantity": details.count },
          }
        );
        return { status: true };
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      throw err;
    }
  },
  removeProduct: async (details) => {
    try {
      const database = await db.connectToDatabase();
      await database.collection(collection.CART_COLLECTION).updateOne(
        { _id: new ObjectId(details.cart) },
        {
          $pull: { product: { item: new ObjectId(details.product) } },
        }
      );
      return { removeProduct: true };
    } catch (err) {
      console.error("Error updating quantity:", err);
      throw err;
    }
  },
  getTotalAmount: async (userId) => {
    try {
      const database = await connectToDatabase();
      let total = await database
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: new ObjectId(userId) },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
              quantity: { $toInt: "$product.quantity" }, // Convert string to integer
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $set: {
              price: { $toDouble: "$product.price" }, // Convert string to double
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: { $multiply: ["$quantity", "$price"] }, // Multiply numeric fields
              },
            },
          },
        ])
        .toArray();
      // console.log(total);
      if (total.length > 0) {
        return total[0].total;
      } else {
        return 0;
      }
    } catch (err) {
      console.error("Error showing the cart:", err);
      throw err;
    }
  },
  placeOrder: async (order, products, total) => {
    try {
      // console.log(order, products, total);
      let status = order["payment-method"] === "COD" ? "placed" : "success"; //checking condition to cod or online payment
      let orderObj = {
        deliveryDetails: {
          name: order.name,
          mobile: order.mobile,
          address: order.address,
          pincode: order.pincode,
        },
        userId: new ObjectId(order.userId),
        paymentMethod: order["payment-method"],
        products: products,
        totalAmount: total,
        date: new Date(),
        status: status,
      };
      const database = await db.connectToDatabase();
      let response = await database
      .collection(collection.ORDER_COLLECTION)
      .insertOne(orderObj);

      await database.collection(collection.CART_COLLECTION).deleteOne({ user: new ObjectId(order.userId) });

      return String(response.insertedId);
    } catch (err) {
      console.error("Error updating quantity:", err);
      throw err;
    }
  },
  getCartProductList: async (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        const database = await db.connectToDatabase();
        let cart = await database
          .collection(collection.CART_COLLECTION)
          .findOne({ user: new ObjectId(userId) });
        resolve(cart.product);
      });
    } catch (err) { 
      console.error("Error updating quantity:", err);
      throw err;
    }
  },
  getUserOrders: async (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        const database = await db.connectToDatabase();
        let orders = await database
          .collection(collection.ORDER_COLLECTION)
          .find({ userId: new ObjectId(userId) })
          .toArray();
        //console.log(orders);
        resolve(orders);
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      throw err;
    }
  },
  getOrderProducts: async (orderId) => {
    try {
      return new Promise(async (resolve, reject) => {
        const database = await connectToDatabase();
        let orderItems = await database
          .collection(collection.ORDER_COLLECTION)
          .aggregate([
            {
              $match: { _id: new ObjectId(orderId) },
            },
            {
              $unwind: "$products",
            },
            {
              $project: {
                item: "$products.item",
                quantity: "$products.quantity",
              },
            },
            {
              $lookup: {
                from: collection.PRODUCT_COLLECTION,
                localField: "item",
                foreignField: "_id",
                as: "products",
              },
            },
            {
              $project: {
                item: 1,
                quantity: 1,
                product: { $arrayElemAt: ["$products", 0] },
              },
            },
          ])
          .toArray();

        resolve(orderItems);
      });
    } catch (err) {
      console.error("Error showing the cart:", err);
      throw err;
    }
  },
  generateRazorpay: (orderId,total) => {
    try{
      return new Promise((resolve, reject) => {
      
      var options={
     
        amount: total,
        currency: "INR",
        receipt: orderId
      };
      instance.orders.create(options, function(err, order){
       if(err){
        console.log(err);
       }else{
        console.log("Order",order);
        resolve(order)
      }
      });
    });
  }catch (err){
    console.log(err);
  }
  },
};
