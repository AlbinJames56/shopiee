const db = require('../config/connection');
//const { connectToDatabase } = require('../config/connection');
var collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { log } = require('handlebars');





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
    }
};

 