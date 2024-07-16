const mongoose = require('mongoose');
const Flight = require('./models/Flight');
const Booking = require('./models/Booking');

mongoose.connect('mongodb://localhost:27017/flightbooking', { useNewUrlParser: true, useUnifiedTopology: true });

const seedFlights = async () => {
    const flights = [
        {
            airline: 'Airline Chennai',
            flightNumber: 'AB123',
            departure: 'New York',
            arrival: 'London',
            departureTime: new Date('2023-12-31T10:00:00.000Z'),
            arrivalTime: new Date('2023-12-31T20:00:00.000Z'),
            price: 500
        },
        {
            airline: 'Kochi Airline',
            flightNumber: 'CD456',
            departure: 'San Francisco',
            arrival: 'Tokyo',
            departureTime: new Date('2023-11-15T08:00:00.000Z'),
            arrivalTime: new Date('2023-11-15T18:00:00.000Z'),
            price: 750
        }
    ];

    await Flight.insertMany(flights);
    console.log('Flights added');
};

const seedBookings = async () => {
    const flight = await Flight.findOne({ flightNumber: 'AB123' });

    const bookings = [
        {
            userEmail: 'user@example.com',
            flightId: flight._id,
            bookingTime: new Date()
        }
    ];

    await Booking.insertMany(bookings);
    console.log('Bookings added');
};

const seedDatabase = async () => {
    await seedFlights();
    await seedBookings();
    mongoose.connection.close();
};

seedDatabase().catch(error => {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
});
