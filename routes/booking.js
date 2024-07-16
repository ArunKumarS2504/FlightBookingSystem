const express = require('express');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

const router = express.Router();

// Get Bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('flightId');
        res.json(bookings);
    } catch (error) {
        res.status(400).send('Error fetching bookings');
    }
});

// Cancel Booking
router.delete('/:id', async (req, res) => {
    try {
        await Booking.deleteOne({ _id: req.params.id });
        res.send('Booking cancelled');
    } catch (error) {
        res.status(400).send('Error cancelling booking');
    }
});

module.exports = router;
