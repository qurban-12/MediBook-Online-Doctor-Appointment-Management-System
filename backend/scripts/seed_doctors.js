#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');

const doctors = [
  {
    name: 'Dr Qurban Ali Rajar',
    specialization: 'Cardiologist',
    experience: 12,
    fee: 1800,
    image: '',
    availableSlots: ['09:00 AM', '11:30 AM', '04:00 PM']
  },
  {
    name: 'Dr Ayesha Malik',
    specialization: 'Gynecologist',
    experience: 10,
    fee: 1500,
    image: '',
    availableSlots: ['10:00 AM', '01:00 PM', '05:30 PM']
  },
  {
    name: 'Dr Hassan Shah',
    specialization: 'Dermatologist',
    experience: 8,
    fee: 1200,
    image: '',
    availableSlots: ['09:30 AM', '12:30 PM', '03:30 PM']
  },
  {
    name: 'Dr Sana Ahmed',
    specialization: 'Pediatrician',
    experience: 9,
    fee: 1400,
    image: '',
    availableSlots: ['08:30 AM', '11:00 AM', '02:30 PM']
  },
  {
    name: 'Dr Imran Ali',
    specialization: 'Orthopedic Surgeon',
    experience: 14,
    fee: 2200,
    image: '',
    availableSlots: ['10:30 AM', '01:30 PM', '06:00 PM']
  }
];

async function seedDoctors() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment');
  }

  await mongoose.connect(mongoUri);

  let inserted = 0;
  let updated = 0;

  for (const doctor of doctors) {
    const result = await Doctor.updateOne(
      { name: doctor.name, specialization: doctor.specialization },
      { $set: doctor },
      { upsert: true }
    );

    if (result.upsertedCount > 0) inserted += 1;
    else if (result.modifiedCount > 0) updated += 1;
  }

  console.log(`Seed complete. Inserted: ${inserted}, Updated: ${updated}`);
}

seedDoctors()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error('Doctor seeding failed:', error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // ignore disconnect errors
    }
    process.exit(1);
  });
