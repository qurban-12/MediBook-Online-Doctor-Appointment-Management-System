import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        if (active) setDoctors(response.data);
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Failed to load doctors');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDoctors();

    return () => {
      active = false;
    };
  }, []);

  // Extract unique specializations from doctors
  const uniqueSpecializations = useMemo(() => {
    const specs = new Set(doctors.map((d) => d.specialization).filter(Boolean));
    return Array.from(specs).sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    let result = doctors;

    // Apply specialization filter
    if (selectedSpecialization) {
      result = result.filter((doctor) => doctor.specialization === selectedSpecialization);
    }

    // Apply search query
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      result = result.filter((doctor) => {
        const name = doctor.name?.toLowerCase() || '';
        const specialization = doctor.specialization?.toLowerCase() || '';
        return name.includes(normalizedQuery) || specialization.includes(normalizedQuery);
      });
    }

    return result;
  }, [doctors, query, selectedSpecialization]);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">Available Doctors</h1>
          <p className="text-secondary mb-0">Browse public doctor profiles from the backend.</p>
        </div>
        {user && <Link className="btn btn-primary" to="/appointments/new">Book Appointment</Link>}
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

      {/* Filter by Specialization */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h6 className="mb-0 fw-semibold">Filter by Specialization</h6>
          {selectedSpecialization && (
            <button
              className="btn btn-link btn-sm text-decoration-none"
              onClick={() => setSelectedSpecialization('')}
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="d-flex flex-wrap gap-2">
          {uniqueSpecializations.length === 0 ? (
            <span className="text-secondary small">No specializations available</span>
          ) : (
            uniqueSpecializations.map((spec) => (
              <button
                key={spec}
                type="button"
                className={`btn btn-sm ${
                  selectedSpecialization === spec ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => setSelectedSpecialization(selectedSpecialization === spec ? '' : spec)}
              >
                {spec}
              </button>
            ))
          )}
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading doctors...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && filteredDoctors.length === 0 && (
        <div className="alert alert-secondary">
          {query || selectedSpecialization
            ? 'No doctors match your search or filter criteria.'
            : 'No doctors available yet.'}
        </div>
      )}

      <div className="row g-4">
        {filteredDoctors.map((doctor) => (
          <div className="col-md-6 col-lg-4" key={doctor._id}>
            <div className="card h-100 shadow-lg border-0 position-relative doctor-card">
              <div className="card-body text-center">
                <Link to={`/doctors/${doctor._id}`} className="doctor-avatar-link mb-3" aria-label={`Open ${doctor.name} details`}>
                  <img
                    src={doctor.image || 'https://ui-avatars.com/api/?name=MediBook&background=001f3f&color=ffffff&size=512&bold=true'}
                    alt={doctor.name}
                    className="doctor-avatar"
                  />
                </Link>
                <h2 className="h5 mb-1">
                  <Link className="doctor-card__title" to={`/doctors/${doctor._id}`}>
                    {doctor.name}
                  </Link>
                </h2>
                <p className="text-primary mb-2">{doctor.specialization}</p>
                {doctor.description && <p className="text-secondary small mb-2">{doctor.description}</p>}
                <div className="small text-secondary mb-2">Experience: {doctor.experience} years</div>
                <div className="small text-secondary mb-3">Consultation Fee: ${doctor.fee}</div>
                {Array.isArray(doctor.availableSlots) && doctor.availableSlots.length > 0 && (
                  <div>
                    <div className="fw-semibold mb-2">Available slots</div>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      {doctor.availableSlots.map((slot) => (
                        <span className="badge text-bg-light border" key={slot}>{slot}</span>
                      ))}
                    </div>
                  </div>
                )}
                {user && (
                  <div className="mt-3">
                    <Link className="btn btn-outline-primary btn-sm" to="/appointments/new" state={{ doctor }}>
                      Book this doctor
                    </Link>
                  </div>
                )}
              </div>
              <Link className="stretched-link" to={`/doctors/${doctor._id}`} aria-label={`View ${doctor.name} details`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}