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
      <section className="mb-home-hero p-4 p-lg-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="badge text-bg-light text-primary mb-3">MediBook Healthcare Platform</span>
            <h1 className="display-5 fw-bold text-white">Welcome to MediBook.</h1>
            <div className="d-flex gap-3 mt-3 mb-3 flex-wrap">
              <Link className="btn btn-light btn-lg d-flex align-items-center mb-home-cta" to="/register">
                <span className="btn-icon" aria-hidden="true" />
                <span>Book Appointment</span>
              </Link>
              <Link className="btn btn-outline-light btn-lg d-flex align-items-center" to="/doctors">
                <span>Browse Doctors</span>
              </Link>
            </div>
            <p className="lead text-white-50 mt-3 mb-4">
              Manage doctor discovery, appointment booking, and patient records in one clean place.
            </p>
          </div>
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg h-100 mb-home-hero__card">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h4 text-primary">About the system</h2>
                <p className="text-secondary mb-4">
                  MediBook helps patients quickly find doctors, check availability, and reserve appointments with clear tracking for admins.
                </p>
                <div className="d-flex flex-column gap-3">
                  <div className="mb-home-feature">
                    <div className="mb-home-feature__icon">✓</div>
                    <div>
                      <div className="fw-semibold">Fast booking</div>
                      <div className="text-secondary small">Pick a doctor and reserve a slot in seconds.</div>
                    </div>
                  </div>
                  <div className="mb-home-feature">
                    <div className="mb-home-feature__icon">⌁</div>
                    <div>
                      <div className="fw-semibold">Live tracking</div>
                      <div className="text-secondary small">See pending, approved, completed, and cancelled status.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {pageError && <div className="alert alert-danger">{pageError}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100 mb-home-metric mb-home-metric--featured">
            <div className="card-body p-4 p-lg-5">
              <div className="text-secondary fw-semibold text-uppercase small mb-2">Total doctors</div>
              <div className="mb-home-metric__value mb-home-metric__value--featured">{stats.totalDoctors}</div>
              <p className="text-secondary mb-0">Available doctors ready to consult and book.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100 mb-home-metric mb-home-metric--featured">
            <div className="card-body p-4 p-lg-5">
              <div className="text-secondary fw-semibold text-uppercase small mb-2">Total appointments</div>
              <div className="mb-home-metric__value mb-home-metric__value--featured">{stats.totalAppointments}</div>
              <p className="text-secondary mb-0">Appointments booked across the platform.</p>
            </div>
          </div>
        </div>

        {highlights.slice(2).map((item) => (
          <div className="col-6 col-lg-3" key={item.label}>
            <div className="card shadow-sm border-0 h-100 mb-home-metric">
              <div className="card-body text-center p-4">
                <div className="mb-home-metric__value">{item.value}</div>
                <div className="text-secondary fw-semibold">{item.label}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 mb-home-metric">
            <div className="card-body text-center p-4">
              <div className="mb-home-metric__value">{stats.completedAppointments}</div>
              <div className="text-secondary fw-semibold">Completed</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 mb-home-metric">
            <div className="card-body text-center p-4">
              <div className="mb-home-metric__value">{stats.cancelledAppointments}</div>
              <div className="text-secondary fw-semibold">Cancelled</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-lg-12">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <div className="text-secondary small text-uppercase fw-semibold">Top picks</div>
              <h2 className="h4 mb-0">Featured doctors</h2>
            </div>
            <Link className="btn btn-outline-primary btn-sm" to="/doctors">View all</Link>
          </div>
        </div>
        {stats.featuredDoctors.slice(0, 3).map((doctor) => (
          <div className="col-md-4" key={doctor._id}>
            <div className="card shadow border-0 h-100 doctor-card mb-home-doctor-card mb-home-doctor-card--featured">
              <div className="card-body text-center p-4 p-lg-5">
                <span className="badge text-bg-light text-primary mb-3">Featured doctor</span>
                <img
                  src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'Doctor')}&background=001f3f&color=f7f8f6&size=192`}
                  alt={doctor.name}
                  className="doctor-avatar doctor-avatar--lg mb-3 mb-home-doctor-card__avatar"
                />
                <h3 className="h5 mb-1">{doctor.name}</h3>
                <p className="text-secondary mb-2">{doctor.specialization}</p>
                <div className="small text-secondary mb-3">{doctor.experience} years experience · ${doctor.fee}</div>
                <Link className="btn btn-primary btn-sm px-4" to="/doctors">
                  View profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}