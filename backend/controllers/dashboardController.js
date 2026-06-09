const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard stats for the authenticated patient
exports.getDashboardStats = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
        }

        const patientId = req.user.id;

        const [totalAppointments, upcomingAppointments, completedAppointments, cancelledAppointments] = await Promise.all([
            Appointment.countDocuments({ patientId }),
            Appointment.countDocuments({
                patientId,
                status: { $nin: ['Completed', 'Cancelled'] },
                appointmentDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            }),
            Appointment.countDocuments({ patientId, status: 'Completed' }),
            Appointment.countDocuments({ patientId, status: 'Cancelled' })
        ]);

        res.status(200).json({
            totalAppointments,
            upcomingAppointments,
            completedAppointments,
            cancelledAppointments,
        });
    } catch (error) {
        console.error(error.message);
        if (error.name === 'MongooseError' || /buffering timed out/i.test(error.message || '')) {
            return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};