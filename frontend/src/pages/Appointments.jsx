import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const emptyEdit = { appointmentDate: '', timeSlot: '', status: '' };

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editForm, setEditForm] = useState(emptyEdit);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!active) return;
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/appointments');
        if (active) setAppointments(response.data);
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Failed to load appointments');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, []);

  const visibleAppointments = useMemo(() => {
    if (user?.role === 'admin') return appointments;
    return appointments.filter((appointment) => appointment.patientId?._id === user?.id);
  }, [appointments, user]);

  const beginEdit = (appointment) => {
    setEditingId(appointment._id);
    setEditForm({
      appointmentDate: appointment.appointmentDate?.slice(0, 10) || '',
      timeSlot: appointment.timeSlot || '',
      status: appointment.status || 'Pending',
    });
    setMessage('');
  };

  const cancelEdit = () => {
    setEditingId('');
    setEditForm(emptyEdit);
  };

  const saveEdit = async (appointment) => {
    try {
      await api.put(`/appointments/${appointment._id}`, {
        patientId: appointment.patientId?._id || appointment.patientId,
        doctorId: appointment.doctorId?._id || appointment.doctorId,
        appointmentDate: editForm.appointmentDate,
        timeSlot: editForm.timeSlot,
        status: user?.role === 'admin' ? editForm.status : appointment.status,
      });
      setMessage('Appointment updated successfully.');
      cancelEdit();
      try { const res = await api.get('/appointments'); setAppointments(res.data); } catch { /* ignore */ }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to update appointment');
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.delete(`/appointments/${appointmentId}`);
      setMessage('Appointment cancelled.');
      try { const res = await api.get('/appointments'); setAppointments(res.data); } catch { /* ignore */ }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">Appointments</h1>
          <p className="text-secondary mb-0">
            {user?.role === 'admin' ? 'Manage all bookings and status updates.' : 'Review and manage your bookings.'}
          </p>
        </div>
        <Link className="btn btn-primary" to="/appointments/new">Book New</Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading appointments...</div>}

      {!loading && visibleAppointments.length === 0 && (
        <div className="alert alert-secondary">No appointments found.</div>
      )}

      <div className="row g-4">
        {visibleAppointments.map((appointment) => {
          const doctor = appointment.doctorId || {};
          const patient = appointment.patientId || {};
          const isEditing = editingId === appointment._id;

          return (
            <div className="col-lg-6" key={appointment._id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between gap-3 flex-wrap mb-2">
                    <div>
                      <h2 className="h5 mb-1">{doctor.name || 'Doctor'}</h2>
                      <p className="text-secondary mb-0">{doctor.specialization || 'Specialization unavailable'}</p>
                    </div>
                    <span className={`badge text-bg-${appointment.status === 'Approved' ? 'success' : appointment.status === 'Cancelled' ? 'secondary' : appointment.status === 'Completed' ? 'primary' : 'warning'}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <dl className="row small mb-3">
                    <dt className="col-4">Patient</dt>
                    <dd className="col-8 mb-2">{patient.name || 'Current user'}</dd>
                    <dt className="col-4">Date</dt>
                    <dd className="col-8 mb-2">{appointment.appointmentDate?.slice(0, 10)}</dd>
                    <dt className="col-4">Time</dt>
                    <dd className="col-8 mb-2">{appointment.timeSlot}</dd>
                  </dl>

                  {isEditing ? (
                    <div className="border-top pt-3 mt-3">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={editForm.appointmentDate}
                            onChange={(event) => setEditForm((current) => ({ ...current, appointmentDate: event.target.value }))}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Time Slot</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm.timeSlot}
                            onChange={(event) => setEditForm((current) => ({ ...current, timeSlot: event.target.value }))}
                          />
                        </div>
                        {user?.role === 'admin' && (
                          <div className="col-12">
                            <label className="form-label">Status</label>
                            <select
                              className="form-select"
                              value={editForm.status}
                              onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))}
                            >
                              <option>Pending</option>
                              <option>Approved</option>
                              <option>Completed</option>
                              <option>Cancelled</option>
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => saveEdit(appointment)}>Save</button>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex gap-2 flex-wrap">
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => beginEdit(appointment)}>
                        {user?.role === 'admin' ? 'Manage' : 'Update'}
                      </button>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteAppointment(appointment._id)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}