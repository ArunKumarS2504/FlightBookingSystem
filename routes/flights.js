const express = require('express');
const Booking = require('../models/Booking');
const pdfkit = require('pdfkit');
const nodemailer = require('nodemailer');
const Flight = require('../models/Flight');
const mongoose = require('mongoose');
const router = express.Router();

// Search Flights
router.get('/search', async (req, res) => {
    const { departure, arrival, date } = req.query;

    try {
        const flights = await Flight.find({ departure, arrival, departureTime: { $gte: new Date(date) } });
        res.json(flights);
    } catch (error) {
        res.status(400).send('Error searching flights');
    }
});

// Book Flight
router.post('/book', async (req, res) => {
    const { flightId, userEmail } = req.body;
        console.log(`Received flightID: ${flightId}, userEmail: ${userEmail}`)
    try {
        if (!mongoose.Types.ObjectId.isValid(flightId)) {
            console.error('Invalid flightId:', flightId);
            return res.status(400).send('Invalid flightId');
        }
        const flight = await Flight.findById(flightId);
        if (!flight) {
            console.error('Flight not found:', flightId);
            return res.status(404).send('Flight not found');
        }
        const booking = new Booking({ flightId: flight._id, userEmail });

        await booking.save();

        // Generate PDF
        const doc = new pdfkit();
        doc.text(`Booking Details:\nFlight: ${flight.airline} ${flight.flightNumber}\nDeparture: ${flight.departure}\nArrival: ${flight.arrival}`);
        const pdfBuffer = await new Promise(resolve => {
            const buffer = [];
            doc.on('data', buffer.push.bind(buffer));
            doc.on('end', () => resolve(Buffer.concat(buffer)));
            doc.end();
        });

        // Send Email
        const transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: 'your-email@gmail.com', pass: 'your-password' } });
        const mailOptions = { from: 'your-email@gmail.com', to: userEmail, subject: 'Booking Confirmation', text: 'Your booking is confirmed.', attachments: [{ filename: 'booking.pdf', content: pdfBuffer }] };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error){
                console.error('Error sending email:', error);
                return res.status(400).send('Error sending email');
            } 
            res.json({ message: 'Booking confirmed and email sent' });
        });

    } catch (error) {
        console.error('Error booking flight:', error);
        res.status(400).send('Error booking flight');
    }
});

module.exports = router;
