const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding');

  // Ensure we have a doctor to reference
  let doctor = await Doctor.findOne();
  if (!doctor) {
    doctor = await Doctor.create({ name: 'Seed Doctor', specialization: 'General', fee: 50, experience: 5 });
    console.log('Created seed doctor:', doctor._id.toString());
  }

  const patientId = new mongoose.Types.ObjectId('000000000000000000000000');

  // Create upcoming appointment (Approved)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 5);

  const created = [];

  created.push(await Appointment.create({
    patientId,
    doctorId: doctor._id,
    appointmentDate: tomorrow,
    timeSlot: '10:00 AM',
    status: 'Approved'
  }));

  created.push(await Appointment.create({
    patientId,
    doctorId: doctor._id,
    appointmentDate: pastDate,
    timeSlot: '09:00 AM',
    status: 'Completed'
  }));

  created.push(await Appointment.create({
    patientId,
    doctorId: doctor._id,
    appointmentDate: pastDate,
    timeSlot: '11:00 AM',
    status: 'Cancelled'
  }));

  console.log('Seeded appointments:', created.map((c) => ({ id: c._id.toString(), status: c.status })));

  await mongoose.disconnect();
  console.log('Disconnected, seed complete');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
