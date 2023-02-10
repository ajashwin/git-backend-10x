const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        default: "Ashwin"
    },
    password: {
        type: String,
        require: true,
        default: "Ashwin@123"
    }
}) 

//in exports, we r exporting an object since in future, we'll be creating many other schemas so schema key will be User
// so that we'll be importing it with user when we destructure it over here in index.js
// and we take mongoose.model() in which model function takes 2 things one is collection name in singular form which is unique value in our database which tends to be plural
// and other one is we r registering the schema which we r using which is UserSchema
//model is a function which return an object and that object we r keeping it as a value for user key

module.exports = {User: mongoose.model("InstaUser", UserSchema)}

//now we'll import this User in index.js file