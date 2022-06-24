require("dotenv").config();
const express=require("express")
const app= express();
const jwt = require('jsonwebtoken');
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt")
require("./database/connection");
const User =require("./models/user.model");
const Car=require("./models/car.model");
const port= process.env.PORT||1500;
const nodemailer = require('nodemailer');


const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);


app.get("/",(req,res)=>{
    res.render("signup")
});
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/carrecord",(req,res)=>{
    res.render("carrecord");
})
app.get("/signout",(req,res)=>{
    res.render("login");
})
app.get("/showcar",(req,res)=>{
    res.render("showcar");
})
app.get("/dashboard",(req,res)=>{
    res.render("dashboard");
})


app.post('/signup', async (req, res) => {
    try {
        console.log('/signup check', req.body.email);
        const userExist = await User.findOne({ email: req.body.email });
        if(userExist) {
            return res.status(400).send({
                success: false,
                message: 'User exist'
            });
        }
        const password = Math.floor(100000 + Math.random() * 900000);
        const hashedPassword = await bcrypt.hash(password.toString(), 10);
        const token=jwt.sign({id:User._id},process.env.SIGNING_SECRET);
            
        
        const userData = {
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            tokens:token
        };



        console.log(token)
        const registerUser = await User.create(userData);
        console.log('user register response', registerUser);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'bajwaumairbajwa33@gmail.com',
              pass: process.env.password
            }
          });
          
          let mailOptions = {
            from: 'umairsaeed2461997@gmail.com',
            to: req.body.email,
            subject: 'Welcome to Umair Car show room',
            text: `You have successfuly registered to our platform. This is your email: ${req.body.email} and password: ${password}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log('Error in sedning email', error);
              return res.status(500).send({
                  success: false,
                  message: 'Something went wrong. Please try again.'
              })
            }
          });
          return res.render("login")
    } catch (error) {
        console.log('got error in /signup', error);
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log('/login called', req.body);
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (isValidPassword) {

           
            res.render("dashboard");
            
            // Render dashboard page and send back jwt
        } else {
            console.log('invalid password');
        }
        } catch (error) {
        console.log('got error in login', error);
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.get('/dashboards', async (req, res) => {
    try {
        
        console.log('GET /dashboard called');
        const totalCars = await Car.find();
        return res.status(200).send({
            success: true,
            totalCars: totalCars.length
        });
    } catch (error) {
        console.log('got error in dashboard', error);
        return res.status(500).send({
            success: false,
            message: 'Internal sever error'
        });
    }
});

app.get('/cars', async (req, res) => {
    try {
        console.log('GET /cars called');
        const cars = await Car.find();
        return res.status(200).send({
            
            cars
        })
    } catch (error) {
        console.log('got error in GET /cars', error);
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.post('/car', async (req, res) => {
    try {
        console.log('POST /car called', req.body);
        const response = await Car.create({
            category: req.body.category,
            color: req.body.color,
            model: req.body.model,
            make: req.body.make,
            registration_no: req.body.registration_no
        });
        //const cars = await Car.find();
        return res.status(200).render("dashboard");
    } catch (error) {
        console.log('got error in POST /car', error);
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    }
});






app.listen(port,()=>{

    console.log(`connection at the port number ${port}`);
})