const Appointment = require('../models/Appointment');

// @route   POST /api/appointments
// @desc    Book a new appointment
exports.bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate, timeSlot } = req.body;

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