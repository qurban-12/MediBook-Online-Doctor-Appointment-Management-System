const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const auth = require('../middleware/auth');
const {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    patchDoctor,
    deleteDoctor
} = require('../controllers/doctorController');

// Define API routes for doctors
router.post(
    '/',
    auth,
    [
        check('name', 'Name is required').notEmpty(),
        check('specialization', 'Specialization is required').notEmpty(),
        check('fee', 'Fee must be a number').optional().isNumeric()
    ],
    validateRequest,
    createDoctor
); // POST: Add new doctor

router.get('/', getAllDoctors); // GET: Fetch all doctors (public)
router.get('/:id', getDoctorById); // GET: Fetch single doctor (public)

router.put(
    '/:id',
    auth,
    [
        check('name', 'Name is required').notEmpty(),
        check('specialization', 'Specialization is required').notEmpty(),
        check('fee', 'Fee must be a number').optional().isNumeric()
    ],
    validateRequest,
    updateDoctor
); // PUT: Update entire doctor record

router.patch('/:id', auth, patchDoctor); // PATCH: Update specific fields (partial update)
router.delete('/:id', auth, deleteDoctor); // DELETE: Remove doctor

module.exports = router;