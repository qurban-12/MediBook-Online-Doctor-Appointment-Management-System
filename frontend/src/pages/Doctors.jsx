import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        if (active) {
          setDoctors(response.data);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load doctors');
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
  }, []);

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return doctors;
    return doctors.filter((doctor) => {
      const name = doctor.name?.toLowerCase() || '';
      const specialization = doctor.specialization?.toLowerCase() || '';
      return name.includes(normalizedQuery) || specialization.includes(normalizedQuery);
    });
  }, [doctors, query]);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">Available Doctors</h1>
          <p className="text-secondary mb-0">Browse public doctor profiles from the backend.</p>
        </div>
        {user && (
          <Link className="btn btn-primary" to="/appointments/new">Book Appointment</Link>
        )}
      </div>

      <div className="mb-4">
        <input
          type="search"
          className="form-control form-control-lg"
          placeholder="Search by doctor name or specialty"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loading && <div className="alert alert-info">Loading doctors...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && filteredDoctors.length === 0 && (
        <div className="alert alert-secondary">No doctors available yet.</div>
      )}

      <div className="row g-4">
        {filteredDoctors.map((doctor) => (
          <div className="col-md-6 col-lg-4" key={doctor._id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h2 className="h5 mb-1"><Link to={`/doctors/${doctor._id}`}>{doctor.name}</Link></h2>
                <p className="text-primary mb-2">{doctor.specialization}</p>
                <div className="small text-secondary mb-2">Experience: {doctor.experience} years</div>
                <div className="small text-secondary mb-3">Consultation Fee: ${doctor.fee}</div>
                {Array.isArray(doctor.availableSlots) && doctor.availableSlots.length > 0 && (
                  <div>
                    <div className="fw-semibold mb-2">Available slots</div>
                    <div className="d-flex flex-wrap gap-2">
                      {doctor.availableSlots.map((slot) => (
                        <span className="badge text-bg-light border" key={slot}>{slot}</span>
                      ))}
                    </div>
                  </div>
                )}
                {user && (
                  <div className="mt-3">
                    <Link
                      className="btn btn-outline-primary btn-sm"
                      to="/appointments/new"
                      state={{ doctor }}
                    >
                      Book this doctor
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}