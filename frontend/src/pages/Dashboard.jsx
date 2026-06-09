import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });
  const [doctorForm, setDoctorForm] = useState({ name: '', specialization: '', experience: '', fee: '', image: '', availableSlots: '' });
  const [doctorError, setDoctorError] = useState('');
  const [dashboardMessage, setDashboardMessage] = useState('');
  const [appointmentError, setAppointmentError] = useState('');
  const [editingDoctorId, setEditingDoctorId] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorResponse, myAppointmentResponse, statsResponse] = await Promise.all([
          api.get('/doctors'),
          api.get('/appointments/my').catch(() => ({ data: [] })),
          api.get('/dashboard/stats').catch(() => ({ data: dashboardStats })),
        ]);
        setDoctors(doctorResponse.data);
        setAppointments(myAppointmentResponse.data);
        setDashboardStats({
          totalAppointments: statsResponse.data.totalAppointments ?? 0,
          upcomingAppointments: statsResponse.data.upcomingAppointments ?? 0,
          completedAppointments: statsResponse.data.completedAppointments ?? 0,
          cancelledAppointments: statsResponse.data.cancelledAppointments ?? 0,
        });
      } catch (requestError) {
        setDoctorError(requestError.response?.data?.message || 'Failed to load dashboard data');
      }
    };

    loadData();
  }, []);

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((left, right) => new Date(right.createdAt || right.appointmentDate) - new Date(left.createdAt || left.appointmentDate))
      .slice(0, 5);
  }, [appointments]);

  const statusBadgeClass = (status) => {
    if (status === 'Approved') return 'success';
    if (status === 'Completed') return 'primary';
    if (status === 'Cancelled') return 'secondary';
    return 'warning';
  };

  const handleAppointmentStatus = async (appointmentId, status) => {
    setAppointmentError('');
    setDashboardMessage('');

    try {
      await api.patch(`/appointments/${appointmentId}`, { status });
      const response = await api.get('/appointments').catch(() => ({ data: [] }));
      setAppointments(response.data);
      setDashboardMessage(`Appointment marked as ${status.toLowerCase()}.`);
    } catch (requestError) {
      setAppointmentError(requestError.response?.data?.message || 'Failed to update appointment');
    }
  };

  const submitDoctor = async (event) => {
    event.preventDefault();
    setDoctorError('');
    setDashboardMessage('');

    const payload = {
      name: doctorForm.name,
      specialization: doctorForm.specialization,
      experience: Number(doctorForm.experience),
      fee: Number(doctorForm.fee),
      image: doctorForm.image,
      availableSlots: doctorForm.availableSlots
        .split(',')
        .map((slot) => slot.trim())
        .filter(Boolean),
    };

    try {
      if (editingDoctorId) {
        await api.put(`/doctors/${editingDoctorId}`, payload);
        setDashboardMessage('Doctor updated successfully.');
      } else {
        await api.post('/doctors', payload);
        setDashboardMessage('Doctor added successfully.');
      }
      setEditingDoctorId('');
      setDoctorForm({ name: '', specialization: '', experience: '', fee: '', image: '', availableSlots: '' });
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (requestError) {
      setDoctorError(requestError.response?.data?.message || 'Failed to save doctor');
    }
  };

  const beginDoctorEdit = (doctor) => {
    setEditingDoctorId(doctor._id);
    setDoctorForm({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      experience: String(doctor.experience ?? ''),
      fee: String(doctor.fee ?? ''),
      image: doctor.image || '',
      availableSlots: Array.isArray(doctor.availableSlots) ? doctor.availableSlots.join(', ') : '',
    });
  };

  const deleteDoctor = async (doctorId) => {
    if (!window.confirm('Delete this doctor?')) return;
    await api.delete(`/doctors/${doctorId}`);
    const response = await api.get('/doctors');
    setDoctors(response.data);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h1 className="h3 mb-3">Welcome back, {user?.name}.</h1>
              <p className="text-secondary mb-4">Your account is connected and ready for appointment features.</p>
              <dl className="row mb-0">
                <dt className="col-sm-3">Email</dt>
                <dd className="col-sm-9">{user?.email}</dd>
                <dt className="col-sm-3">Role</dt>
                <dd className="col-sm-9 text-capitalize">{user?.role}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {dashboardMessage && <div className="alert alert-success mt-4">{dashboardMessage}</div>}
      {doctorError && <div className="alert alert-danger mt-4">{doctorError}</div>}
      {appointmentError && <div className="alert alert-danger mt-4">{appointmentError}</div>}

      <div className="row g-3 mt-4">
        <div className="col-md-3"><div className="card shadow-sm border-0 h-100 mb-home-metric mb-home-metric--featured"><div className="card-body text-center p-4"><div className="mb-home-metric__value">{dashboardStats.totalAppointments}</div><div className="text-secondary fw-semibold">Total Appointments</div></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm border-0 h-100 mb-home-metric mb-home-metric--featured"><div className="card-body text-center p-4"><div className="mb-home-metric__value">{dashboardStats.upcomingAppointments}</div><div className="text-secondary fw-semibold">Upcoming Appointments</div></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm border-0 h-100 mb-home-metric mb-home-metric--featured"><div className="card-body text-center p-4"><div className="mb-home-metric__value">{dashboardStats.completedAppointments}</div><div className="text-secondary fw-semibold">Completed Appointments</div></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm border-0 h-100 mb-home-metric mb-home-metric--featured"><div className="card-body text-center p-4"><div className="mb-home-metric__value">{dashboardStats.cancelledAppointments}</div><div className="text-secondary fw-semibold">Cancelled Appointments</div></div></div></div>
      </div>

      <div className="mt-4 d-flex gap-2 flex-wrap">
        <Link className="btn btn-primary" to="/appointments/new">Book Appointment</Link>
        <Link className="btn btn-outline-primary" to="/appointments">View Appointments</Link>
        <Link className="btn btn-outline-secondary" to="/doctors">Browse Doctors</Link>
      </div>

      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h4 mb-0">Recent Appointments</h2>
          <span className="text-secondary small">Latest {recentAppointments.length} records</span>
        </div>
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  {user?.role === 'admin' && <th className="text-end">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === 'admin' ? 6 : 5} className="text-center py-4 text-secondary">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  recentAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.patientId?.name || 'Patient'}</td>
                      <td>{appointment.doctorId?.name || 'Doctor'}</td>
                      <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                      <td>{appointment.timeSlot}</td>
                      <td>
                        <span className={`badge text-bg-${statusBadgeClass(appointment.status)}`}>{appointment.status}</span>
                      </td>
                      {user?.role === 'admin' && (
                        <td className="text-end">
                          <div className="btn-group btn-group-sm" role="group">
                            <button type="button" className="btn btn-outline-success" onClick={() => handleAppointmentStatus(appointment._id, 'Approved')} disabled={appointment.status === 'Approved'}>Approve</button>
                            <button type="button" className="btn btn-outline-primary" onClick={() => handleAppointmentStatus(appointment._id, 'Completed')} disabled={appointment.status === 'Completed'}>Complete</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => handleAppointmentStatus(appointment._id, 'Cancelled')} disabled={appointment.status === 'Cancelled'}>Cancel</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="mt-5">
          <h2 className="h4 mb-3">Manage Doctors</h2>
          <form className="card shadow-sm border-0 p-4" onSubmit={submitDoctor}>
            <div className="row g-3">
              <div className="col-md-6"><input className="form-control" placeholder="Doctor name" value={doctorForm.name} onChange={(event) => setDoctorForm((current) => ({ ...current, name: event.target.value }))} required /></div>
              <div className="col-md-6"><input className="form-control" placeholder="Specialization" value={doctorForm.specialization} onChange={(event) => setDoctorForm((current) => ({ ...current, specialization: event.target.value }))} required /></div>
              <div className="col-md-4"><input type="number" className="form-control" placeholder="Experience" value={doctorForm.experience} onChange={(event) => setDoctorForm((current) => ({ ...current, experience: event.target.value }))} required /></div>
              <div className="col-md-4"><input type="number" className="form-control" placeholder="Fee" value={doctorForm.fee} onChange={(event) => setDoctorForm((current) => ({ ...current, fee: event.target.value }))} required /></div>
              <div className="col-md-4"><input className="form-control" placeholder="Image URL" value={doctorForm.image} onChange={(event) => setDoctorForm((current) => ({ ...current, image: event.target.value }))} /></div>
              <div className="col-12"><input className="form-control" placeholder="Available slots (comma separated)" value={doctorForm.availableSlots} onChange={(event) => setDoctorForm((current) => ({ ...current, availableSlots: event.target.value }))} /></div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">{editingDoctorId ? 'Update Doctor' : 'Add Doctor'}</button>
              {editingDoctorId && (
                <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditingDoctorId(''); setDoctorForm({ name: '', specialization: '', experience: '', fee: '', image: '', availableSlots: '' }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="row g-3 mt-3">
            {doctors.map((doctor) => (
              <div className="col-md-6 col-lg-4" key={doctor._id}>
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h3 className="h5">{doctor.name}</h3>
                    <p className="text-secondary mb-2">{doctor.specialization}</p>
                    <div className="small mb-3">Fee ${doctor.fee} · {doctor.experience} years</div>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => beginDoctorEdit(doctor)}>Edit</button>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteDoctor(doctor._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}