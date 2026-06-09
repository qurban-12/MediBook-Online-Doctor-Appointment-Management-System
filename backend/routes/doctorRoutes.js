const express = require('express');
const router = express.Router();
const { 
    createDoctor, 
    getAllDoctors, 
    getDoctorById, 
    updateDoctor, 
    patchDoctor, 
    deleteDoctor 
} = require('../controllers/doctorController');

// Define API routes for doctors
router.post('/', createDoctor);       // POST: Add new doctor
router.get('/', getAllDoctors);       // GET: Fetch all doctors
router.get('/:id', getDoctorById);    // GET: Fetch single doctor
router.put('/:id', updateDoctor);     // PUT: Update entire doctor record
router.patch('/:id', patchDoctor);    // PATCH: Update specific fields
router.delete('/:id', deleteDoctor);  // DELETE: Remove doctor

module.exports = router;