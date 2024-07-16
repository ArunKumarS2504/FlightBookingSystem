const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    userEmail: { type: String, required: true },
    flightId: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
    bookingTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', BookingSchema);
