const express = require('express');
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const bodyparser = require('body-parser')
const pdfDocument = require('pdfkit')
const flightRoutes = require('./routes/flights')
const bookingRoutes = require('./routes/booking')

const app = express();
app.use(bodyparser.json());

app.use('/api/flights', flightRoutes)
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/flightbooking",{useNewurlParser:true, useUnifiedTopology:true})

app.listen(PORT,()=>{
    console.log(`server connected to the port ${PORT}`)
})

app.get("/",(req,res)=>{
    res.send('Flight-Booking System');
});

