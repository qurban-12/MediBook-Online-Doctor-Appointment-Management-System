import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        if (!active) return;
        setDoctor(res.data);
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Failed to load doctor');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="container py-5"><div className="alert alert-info">Loading doctor...</div></div>;
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!doctor) return null;

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">{doctor.name}</h1>
          <p className="text-secondary mb-0">{doctor.specialization}</p>
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-primary" to="/doctors">Back</Link>
          <button className="btn btn-primary" onClick={() => navigate('/appointments/new', { state: { doctor } })}>Book Appointment</button>
        </div>
      </div>

      <div className="card shadow-sm border-0 p-4">
        <div className="row g-3">
          <div className="col-md-4 text-center">
              <img
                src={doctor.image || 'https://ui-avatars.com/api/?name=MediBook&background=001f3f&color=ffffff&size=512&bold=true'}
                alt={doctor.name}
                className="doctor-avatar doctor-avatar--lg mx-auto"
            />
          </div>
          <div className="col-md-8">
            <h4 className="h5">About</h4>
            <p>{doctor.description || 'No description available.'}</p>
            <div className="small text-secondary">Experience: {doctor.experience} years</div>
            <div className="small text-secondary">Fee: ${doctor.fee}</div>
          </div>
          <div className="col-12">
            {Array.isArray(doctor.availableSlots) && doctor.availableSlots.length > 0 && (
              <div className="mt-3">
                <h6 className="mb-2">Available slots</h6>
                <div className="d-flex flex-wrap gap-2">
                  {doctor.availableSlots.map((s) => <span key={s} className="badge text-bg-light border">{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
