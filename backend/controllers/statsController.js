const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @route   GET /api/stats
// @desc    Get platform summary metrics for the Home page
exports.getStats = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
        }

        const [totalDoctors, totalAppointments, pendingAppointments, approvedAppointments, completedAppointments, cancelledAppointments] = await Promise.all([
            Doctor.countDocuments(),
            Appointment.countDocuments(),
            Appointment.countDocuments({ status: 'Pending' }),
            Appointment.countDocuments({ status: 'Approved' }),
            Appointment.countDocuments({ status: 'Completed' }),
            Appointment.countDocuments({ status: 'Cancelled' })
        ]);

        const featuredDoctors = await Doctor.find()
            .sort({ experience: -1 })
            .limit(3)
            .select('name specialization experience fee image description');

        res.status(200).json({
            totalDoctors,
            totalAppointments,
            pendingAppointments,
            approvedAppointments,
            completedAppointments,
            cancelledAppointments,
            featuredDoctors
        });
    } catch (error) {
        console.error(error.message);
        if (error.name === 'MongooseError' || /buffering timed out/i.test(error.message || '')) {
            return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};