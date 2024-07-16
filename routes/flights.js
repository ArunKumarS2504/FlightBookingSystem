const express = require('express');
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const pdfkit = require('pdfkit');
const nodemailer = require('nodemailer');

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
    const { flightId } = req.body;
    const token = req.headers['authorization'];

    try {
        const decoded = jwt.verify(token, 'secret');
        const flight = await Flight.findById(flightId);
        const booking = new Booking({ userId: decoded.id, flightId: flight._id });

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
        const mailOptions = { from: 'your-email@gmail.com', to: 'user-email@example.com', subject: 'Booking Confirmation', text: 'Your booking is confirmed.', attachments: [{ filename: 'booking.pdf', content: pdfBuffer }] };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.status(400).send('Error sending email');
            res.json({ message: 'Booking confirmed and email sent' });
        });

    } catch (error) {
        res.status(400).send('Error booking flight');
    }
});

module.exports = router;
