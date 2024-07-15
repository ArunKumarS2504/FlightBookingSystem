const express = require('express');
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const bodyparser = require('body-parser')
const pdfDocument = require('pdfkit')

const app = express();
app.use(bodyparser.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/flightbooking",{useNewurlParser:true, useUnifiedTopology:true})

app.listen(PORT,()=>{
    console.log(`server connected to the port ${PORT}`)
})

app.get("/",(req,res)=>{
    res.send('Flight-Booking System');
});

