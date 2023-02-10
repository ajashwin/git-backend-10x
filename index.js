const express = require('express')
const cors = require('cors')
const app = express();
const fileUpload = require("express-fileupload")
const { User } = require("./models/User");
const{ Post } = require("./models/Post")
//user is kind of constructor function returned by model method
const path = require("path")

const mongoose = require("mongoose") //once we got particular uri, we need to connect this uri string to database, we use mongoose


//while connecting mongodb to our application, we create a string for our url, string is the one which is used to connect
// const uri = `mongodb+srv://Ashwin:<password>@cluster1.neej0gw.mongodb.net/?retryWrites=true&w=majority`
// Ashwin- username, cluster1- database name, <password>- replace with your original password for the particular project u set.
const uri = `mongodb+srv://Ashwin:ajashwin@cluster1.neej0gw.mongodb.net/?retryWrites=true&w=majority`


//we r calling middlewares inside app.use();
app.use(cors());
app.use(express.json()); // this middleware is going to parse the data otherwise req.body will show undefined on clicking submit button
app.use(fileUpload()); // to read the  partition data, we'll attach express fileupload or multer middleware


mongoose.set('strictQuery', true); //copied warning from terminal because of some query issue so keep it on top

//connection to mongodb 
mongoose.connect(uri, (err)=> {
    if(err) {
        console.log("Connection to Mongodb Failed");
    } else {
        console.log("Connected to Mongodb successfully");
    }
})


app.listen(8080, () => console.log("Listening on port 8080"))

//create a post

app.post("/user", async (req, res) => {
    const { username, password } = req.body
    //we'll create an instance of User
    const userObject = new User({
        username,
        password
    })

    //method to create new fields into database in mongodb , we'll use create() and since it will be an asynchronous operation so there maybe some delay
    // we can use async await for catching responses we'll use save() instead of create(), so it will be succesfully pushed into our database
    const response = await userObject.save()
    res.json({ message: response })
})

//now go to mongodb>view monitoring>collections> u can see instausers have been created
// u can find username and password over there in which the api u hit in postman for post http://localhost:8080/user
// inside body is 
//{
//     "usename" : "Ashwin",
//     "password" : "Ash@123"
// }
//u can change also if u want to add more database and it will be added inside database in collections 
// {
//     "username" : "Aditi",
//     "password" : "Aditi@123"
// }




app.post("/api", (req, res) => { 
    const { image_file } = req.files
    //lets capture rest 3 parameters as well, capture regular data in the body as well
    const { username, address, description } = req.body
    //mv function is used to move the file into the destination which is inside this uploads folder with the name
    image_file.mv("./uploads/" + image_file.name, async (err) => {
        if (err) {
            res.json({ message: err })
        } else {
            const post = new Post({ //creating instance of Post Schema
                ...{ username, address, description },
                image_file: image_file.name // capturing file name which we r uploading, image_file is going to be a string
            })
            //now we created a post, lets use try catch block, we might get stuck with an error so we just give try of saving this data
            //if everything goes fine, we'll be inside try block
            //u can create using save method which is on top of instance of particular class Post. Post is a schema which is imported from models Post
            try{
                //since this is going to be asynchronous we'll be saving  it with await keyword
                const response = await post.save() // post.save() will save particular entire object under post
                res.json({message: "Everything is fine", response})
            }catch(e){
                res.json({message: "Something went wrong", response: e })
            }
        }
    })
})


//after making api call for all in Showposts.js, we'll be using get api
app.get("/all", async (req,res)=> {
    //it has to get the response from Post 
    res.json({result: await Post.find()}) //share the data back to the frontend showposts.js
})

 
//design the api for images since images will be taken for get api only. when we use img tag, we use src attrbute so by default it uses get api only
app.get("/images/:fileName", async (req,res)=> {
    console.log(`./uploads/${req.params.fileName}`);
    //basically in response file, in send file, we need to give the address
    //in order to give file path, we'll install package - npm i path
    res.sendFile(path.join(__dirname,`./uploads/${req.params.fileName}`))  //directory name-curr directory, path.join takes 2 args- one is current directory another one is backend directory path for uploads in whcih we want to get the request whatever we had sent for that file
    //now images gets rendered in the browser
})

