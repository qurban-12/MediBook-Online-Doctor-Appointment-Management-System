import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    featuredDoctors: [],
  });
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
      } catch (requestError) {
        setPageError(requestError.response?.data?.message || 'Failed to load home data');
      }
    };

    loadHomeData();
  }, []);

  const highlights = useMemo(() => ([
    { label: 'Doctors', value: stats.totalDoctors },
    { label: 'Appointments', value: stats.totalAppointments },
    { label: 'Pending', value: stats.pendingAppointments },
    { label: 'Approved', value: stats.approvedAppointments },
  ]), [stats]);

  return (
    <div className="container py-5">
      <div className="row align-items-center g-4 mb-4">
        <div className="col-lg-7">
          <span className="badge text-bg-primary mb-3">MediBook Healthcare Platform</span>
          <h1 className="display-5 fw-bold text-primary">Welcome to MediBook.</h1>
          <p className="lead text-secondary mt-3">
            Manage doctor discovery, appointment booking, and patient records in one clean place.
          </p>
          <div className="d-flex gap-3 mt-4 flex-wrap">
            <Link className="btn btn-primary btn-lg d-flex align-items-center" to="/register">
              <span className="btn-icon" aria-hidden="true" />
              <span>Book Appointment</span>
            </Link>
            <Link className="btn btn-outline-primary btn-lg d-flex align-items-center" to="/doctors">
              <span>Browse Doctors</span>
            </Link>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h4">About the system</h2>
              <p className="text-secondary mb-0">
                MediBook helps patients quickly find doctors, check availability, and reserve appointments with clear tracking for admins.
              </p>
            </div>
          </div>
        </div>
      </div>

      {pageError && <div className="alert alert-danger">{pageError}</div>}

      <div className="row g-3 mb-4">
        {highlights.map((item) => (
          <div className="col-6 col-lg-3" key={item.label}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <div className="h4 mb-0">{item.value}</div>
                <div className="text-secondary">{item.label}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="h4 mb-0">{stats.completedAppointments}</div>
              <div className="text-secondary">Completed</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="h4 mb-0">{stats.cancelledAppointments}</div>
              <div className="text-secondary">Cancelled</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-lg-12">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h4 mb-0">Featured doctors</h2>
            <Link className="small text-decoration-none" to="/doctors">View all</Link>
          </div>
        </div>
        {stats.featuredDoctors.slice(0, 3).map((doctor) => (
          <div className="col-md-4" key={doctor._id}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <img
                  src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'Doctor')}&background=001f3f&color=f7f8f6&size=192`}
                  alt={doctor.name}
                  className="doctor-avatar doctor-avatar--lg mb-3"
                />
                <h3 className="h5 mb-1">{doctor.name}</h3>
                <p className="text-secondary mb-2">{doctor.specialization}</p>
                <div className="small text-secondary mb-3">{doctor.experience} years experience · ${doctor.fee}</div>
                <Link className="btn btn-outline-primary btn-sm" to="/doctors">
                  View Doctors
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}