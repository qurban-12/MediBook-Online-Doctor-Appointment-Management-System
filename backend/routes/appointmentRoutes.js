const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    patchAppointmentStatus,
    deleteAppointment
} = require('../controllers/appointmentController');

// Define API routes for appointments
router.post('/', bookAppointment);             // POST: Book new appointment
router.get('/', getAllAppointments);           // GET: Fetch all appointments
router.get('/:id', getAppointmentById);        // GET: Fetch single appointment
router.put('/:id', updateAppointment);         // PUT: Update entire appointment
router.patch('/:id', patchAppointmentStatus);  // PATCH: Update status specifically
router.delete('/:id', deleteAppointment);      // DELETE: Cancel/Remove appointment

module.exports = router;