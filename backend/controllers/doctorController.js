const Doctor = require('../models/Doctor');

// @route   POST /api/doctors
// @desc    Add a new doctor
exports.createDoctor = async (req, res) => {
    try {
        const { name, specialization, experience, fee, availableSlots, image } = req.body;

        const newDoctor = new Doctor({
            name,
            specialization,
            experience,
            fee,
            availableSlots,
            image
        });

        await newDoctor.save();
        res.status(201).json({ message: 'Record created successfully', doctor: newDoctor });
    } catch (error) {
        console.error(error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid input data' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   GET /api/doctors
// @desc    Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   GET /api/doctors/:id
// @desc    Get a single doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   PUT /api/doctors/:id
// @desc    Update a doctor completely (Replaces the whole record)
exports.updateDoctor = async (req, res) => {
    try {
        // Whitelist allowed fields to avoid injection
        const allowedFields = ['name', 'specialization', 'experience', 'fee', 'availableSlots', 'image'];
        const update = {};
        allowedFields.forEach((f) => {
            if (req.body[f] !== undefined) update[f] = req.body[f];
        });

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        if (!doctor) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ message: 'Record updated successfully', doctor });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   PATCH /api/doctors/:id
// @desc    Update specific fields of a doctor (Partial update)
exports.patchDoctor = async (req, res) => {
    try {
        // Only apply allowed fields from request body
        const allowedFields = ['name', 'specialization', 'experience', 'fee', 'availableSlots', 'image'];
        const update = {};
        allowedFields.forEach((f) => {
            if (req.body[f] !== undefined) update[f] = req.body[f];
        });

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        if (!doctor) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ message: 'Record partially updated successfully', doctor });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   DELETE /api/doctors/:id
// @desc    Delete a doctor
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!doctor) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};