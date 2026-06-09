const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

// @route   POST /api/appointments
// @desc    Book a new appointment
exports.bookAppointment = async (req, res) => {
    try {
        // Prefer authenticated user as patientId; fall back to body
        const { patientId: bodyPatientId, doctorId, appointmentDate, timeSlot } = req.body;
        const patientId = req.user && req.user.id ? req.user.id : bodyPatientId;

        const newAppointment = new Appointment({
            patientId,
            doctorId,
            appointmentDate,
            timeSlot
        });

        await newAppointment.save();
        res.status(201).json({ message: 'Record created successfully', appointment: newAppointment });
    } catch (error) {
        console.error(error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid input data' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   GET /api/appointments
// @desc    Get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        // Populating the patient and doctor details so the frontend gets full information
        const appointments = await Appointment.find()
            .populate('patientId', 'name email')
            .populate('doctorId', 'name specialization fee');
        
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   GET /api/appointments/my
// @desc    Get appointments for the authenticated user
exports.getMyAppointments = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
        }

        const appointments = await Appointment.find({ patientId: req.user.id })
            .populate('doctorId', 'name specialization fee image')
            .sort({ appointmentDate: 1, createdAt: -1 });

        res.status(200).json(appointments);
    } catch (error) {
        console.error(error.message);
        if (error.name === 'MongooseError' || /buffering timed out/i.test(error.message || '')) {
            return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   GET /api/appointments/:id
// @desc    Get a single appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patientId', 'name email')
            .populate('doctorId', 'name specialization');

        if (!appointment) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   PUT /api/appointments/:id
// @desc    Update an appointment completely
exports.updateAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate, timeSlot, status } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { patientId, doctorId, appointmentDate, timeSlot, status },
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ message: 'Record updated successfully', appointment });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   PATCH /api/appointments/:id
// @desc    Update appointment status conditionally (e.g., Pending -> Approved)
exports.patchAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ message: 'Record updated successfully', appointment });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   DELETE /api/appointments/:id
// @desc    Delete/Cancel an appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};