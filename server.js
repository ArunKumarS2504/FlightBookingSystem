const express = require('express');
const mongoose = require('mongoose')
const pdfDocument = require('pdfkit')
const flightRoutes = require('./routes/flights')
const bookingRoutes = require('./routes/booking')
const http = require('http');
const socketIo = require('socket.io');
const app = express();
app.use(express.json());

app.use('/api/flights', flightRoutes)
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/flightbooking",{useNewurlParser:true, useUnifiedTopology:true})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.listen(PORT,()=>{
    console.log(`server connected to the port ${PORT}`)
})

app.get("/",(req,res)=>{
    res.send('Flight-Booking System');
});

