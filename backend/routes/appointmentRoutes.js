const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const auth = require('../middleware/auth');
const {
    bookAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    patchAppointmentStatus,
    deleteAppointment
} = require('../controllers/appointmentController');

// Define API routes for appointments
router.post(
    '/',
    auth,
    [
        check('doctorId', 'Doctor ID is required').isMongoId(),
        check('appointmentDate', 'Valid appointment date is required').isISO8601(),
        check('timeSlot', 'Time slot is required').notEmpty()
    ],
    validateRequest,
    bookAppointment
); // POST: Book new appointment (authenticated)

router.get('/', auth, getAllAppointments); // GET: Fetch all appointments (authenticated)
router.get('/:id', auth, getAppointmentById); // GET: Fetch single appointment (authenticated)
router.put('/:id', auth, updateAppointment); // PUT: Update entire appointment (authenticated)
router.patch('/:id', auth, patchAppointmentStatus); // PATCH: Update status specifically (authenticated)
router.delete('/:id', auth, deleteAppointment); // DELETE: Cancel/Remove appointment (authenticated)

module.exports = router;