const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    username: {
        type:String,
        require:true
    },
    address: {
        type:String,
        require:true,
        default: "Bangalore"
    },
    image_file: {
        type:String, //image file is string because we r not going to store the file in database so that is not at all suggested. In uploads folder we'll be pushing the images and that address we'll be stroing in the database.
        require:true
    },
    description: {
        type:String,
        require:true
    }
})

module.exports = {Post: mongoose.model("InstaPost", PostSchema)}