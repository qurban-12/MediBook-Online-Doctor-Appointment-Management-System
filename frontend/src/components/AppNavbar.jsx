import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">MediBook</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <Link className="nav-link text-white" to="/">Home</Link>
            <Link className="nav-link text-white" to="/doctors">Doctors</Link>
            {user ? (
              <>
                <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
                <Link className="nav-link text-white" to="/appointments">Appointments</Link>
                <Link className="nav-link text-white" to="/appointments/new">Book</Link>
                <span className="navbar-text text-white-50 d-none d-lg-inline">{user.name}</span>
                <button type="button" className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="nav-link text-white" to="/login">Login</Link>
                <Link className="btn btn-light btn-sm ms-lg-2" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}