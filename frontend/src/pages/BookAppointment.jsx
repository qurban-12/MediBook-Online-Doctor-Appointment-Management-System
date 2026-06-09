import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookAppointment() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        if (!active) return;
        setDoctors(response.data);
        const preselectedDoctor = location.state?.doctor;
        if (preselectedDoctor?._id) {
          setDoctorId(preselectedDoctor._id);
        } else if (response.data[0]?._id) {
          setDoctorId(response.data[0]._id);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || 'Failed to load doctors');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDoctors();

    return () => {
      active = false;
    };
  }, [location.state]);

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor._id === doctorId),
    [doctors, doctorId],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validate required fields
    if (!doctorId) {
      setError('Please select a doctor.');
      return;
    }
    if (!appointmentDate) {
      setError('Appointment date is required.');
      return;
    }
    if (!timeSlot.trim()) {
      setError('Time slot is required.');
      return;
    }

    // Validate future date
    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('Please select a future date for your appointment.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/appointments', {
        doctorId,
        appointmentDate,
        timeSlot,
        reason,
      });
      navigate('/appointments', { state: { message: 'Appointment booked successfully.' } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading booking form...</div></div>;
  }

  return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">Book Appointment</h1>
          <p className="text-secondary mb-0">Choose a doctor, date, and time slot.</p>
        </div>
        <Link className="btn btn-outline-primary" to="/doctors">Back to doctors</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="card shadow-sm border-0 p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Patient Name</label>
          <input
            type="text"
            className="form-control"
            value={user?.name || ''}
            readOnly
            placeholder="Your name"
          />
          <small className="text-secondary">Appointments are booked under your account</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Doctor</label>
          <select className="form-select" value={doctorId} onChange={(event) => setDoctorId(event.target.value)} required>
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} — {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <div className="alert alert-light border mb-3">
            <strong>{selectedDoctor.name}</strong> · {selectedDoctor.specialization} · Fee ${selectedDoctor.fee}
          </div>
        )}

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Appointment Date</label>
            <input
              type="date"
              className="form-control"
              value={appointmentDate}
              onChange={(event) => setAppointmentDate(event.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Time Slot</label>
            <input
              type="text"
              className="form-control"
              value={timeSlot}
              onChange={(event) => setTimeSlot(event.target.value)}
              placeholder="10:00 AM"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Reason for Visit</label>
          <textarea
            className="form-control"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Describe your symptoms or reason for appointment (optional)"
            rows="3"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-4" disabled={submitting} style={{ backgroundColor: '#001f3f', borderColor: '#001f3f', color: 'white' }}>
          {submitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}