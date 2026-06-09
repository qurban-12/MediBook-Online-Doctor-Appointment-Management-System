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

  const createRipple = (event) => {
    try {
      const target = event.currentTarget;
      if (!target) return;

      // Ensure the link is positioned for absolute children
      if (getComputedStyle(target).position === 'static') {
        target.style.position = 'relative';
      }

      let container = target.querySelector('.ripple-container');
      if (!container) {
        container = document.createElement('span');
        container.className = 'ripple-container';
        container.style.position = 'absolute';
        container.style.inset = '0';
        container.style.overflow = 'hidden';
        container.style.pointerEvents = 'none';
        container.style.borderRadius = getComputedStyle(target).borderRadius || '0px';
        target.appendChild(container);
      }

      const rect = target.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height) * 1.2;
      const radius = diameter / 2;
      const circle = document.createElement('span');
      circle.className = 'ripple';
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - rect.left - radius}px`;
      circle.style.top = `${event.clientY - rect.top - radius}px`;
      container.appendChild(circle);

      window.setTimeout(() => {
        if (circle && circle.parentNode) circle.parentNode.removeChild(circle);
      }, 650);
    } catch (err) {
      // fail silently
    }
  };

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
            <div className="d-flex flex-wrap gap-3">
              <div className="mb-home-hero-icon" aria-hidden="true">
                <svg className="mb-home-hero-icon__svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path fill="currentColor" d="M7 10h5v5H7z" />
                  <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 20V9h14v11H5z" />
                </svg>
                <span className="mb-home-hero-icon__text">Easy booking</span>
              </div>
              <div className="mb-home-hero-icon" aria-hidden="true">
                <svg className="mb-home-hero-icon__svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path fill="currentColor" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-3.33 0-6 1.67-6 3v2h12v-2c0-1.33-2.67-3-6-3z" />
                </svg>
                <span className="mb-home-hero-icon__text">Top doctors</span>
              </div>
              <div className="mb-home-hero-icon" aria-hidden="true">
                <svg className="mb-home-hero-icon__svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path fill="currentColor" d="M19 3H14l-1-1h-2l-1 1H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 8h10v2H7V8zm0 4h10v2H7v-2z" />
                </svg>
                <span className="mb-home-hero-icon__text">Clear tracking</span>
              </div>
            </div>
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
            <Link
              to={`/doctors/${doctor._id}`}
              className="text-decoration-none text-reset d-block mb-home-card-link"
              role="link"
              aria-label={`View profile: ${doctor.name}`}
            >
              <div className="card shadow border-0 h-100 doctor-card mb-home-doctor-card mb-home-doctor-card--featured" tabIndex={-1}>
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
                  <div className="mt-2">
                    <span className="btn btn-primary btn-sm px-4">View profile</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}