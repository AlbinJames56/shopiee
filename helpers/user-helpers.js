const db = require('../config/connection');
const { connectToDatabase } = require('../config/connection');
var collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { log } = require('handlebars');
var {ObjectId} = require("mongodb");



module.exports = {
    doSignup: async (userData) => {
        try {
            userData.password= await bcrypt.hash(userData.password, 8); //Enc.pass
            const database= await db.connectToDatabase(); 
            const data = await database.collection(collection.USER_COLLECTION).insertOne(userData);
            console.log('user added successfully:', data);
            const insertedId = data.insertedId.toString(); // Convert ObjectId to string
            console.log('password:', userData.password);
            return insertedId;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    },
    doLogin: async (userData) =>{
        
        try {
            
            const database= await db.connectToDatabase(); 
            const user = await database.collection(collection.USER_COLLECTION).findOne({email:userData.email});
            if(user){
                const status= await bcrypt.compare(userData.password, user.password)
                    if(status){
                        console.log("Login success");
                        return{user:user,status:true};
                       
                    }else{
                        console.log( "Invalid Password" );
                        return { status: false};
                    }
               
            }else{
                console.log("User not found");
                return { status: false};
            
           
        }
        } catch (error) {
            console.error('Error finding user:', error);
           
        }
    },
    addToCart: async (proId, userId) => {
        try {
          console.log('Adding product to cart...');
          const database = await connectToDatabase();
          console.log('Connected to database');
          const userCart = await database.collection(collection.CART_COLLECTION).findOne({ user: new ObjectId(userId) });
          console.log('User cart:', userCart);
          if (userCart) {
            // Logic for adding product to existing cart

            await database.collection(collection.CART_COLLECTION).updateOne(
                { user: new ObjectId(userId) },
                { $push: { product: new ObjectId(proId) } }
            )
            console.log('Product added to existing cart');
          } else {
            // Create a new cart for the user
            let cartObj = {
              user: new ObjectId(userId),
              product: [new ObjectId(proId)] 
            };
            console.log('New cart object:', cartObj);
            await database.collection(collection.CART_COLLECTION).insertOne(cartObj);
            console.log('Cart inserted successfully');
          }
        } catch (error) {
          console.error("Error adding product to cart:", error);
          throw error; // Throw the error to be caught by the caller
        }
      },
    getCartProducts: async (userId) =>{
        try {
            const database = await connectToDatabase();
            let cartItems=await database.collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:new ObjectId(userId)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        
                        let:{prodList:'$product'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:[ '$_id' , '$$prodList']
                                    }
                                }
                            }
                        ],as:'cartItems'
                    }
                }
            ]).toArray()
            return cartItems[0].cartItems;
        }catch (err){
            console.error("Error showing the cart:", err);
          throw err ;
        }
    }

};