const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number, // Years of experience
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    image: {
        type: String, // URL to the profile image
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    availableSlots: [{
        type: String // Example: "10:00 AM", "02:30 PM"
    }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);