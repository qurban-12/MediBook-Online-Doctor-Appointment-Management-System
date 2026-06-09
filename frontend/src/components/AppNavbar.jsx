import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="mb-sidebar">
      <div className="mb-sidebar__brandRow">
        <Link className="mb-brand" to="/home" aria-label="MediBook home">
          <span className="mb-brand__mark">M</span>
          <span className="mb-brand__text">
            <span className="mb-brand__name">MediBook</span>
            <span className="mb-brand__tag">Smart Doctor Planner</span>
          </span>
        </Link>

      </div>

      <nav className="mb-sidebar__nav" aria-label="Primary navigation">
        <Link className="mb-sidebar__link" to="/home">Home</Link>
        <Link className="mb-sidebar__link" to="/dashboard">Dashboard</Link>
        <Link className="mb-sidebar__link" to="/doctors">Doctors</Link>
        <Link className="mb-sidebar__link" to="/appointments">Appointments</Link>
        <Link className="mb-sidebar__link" to="/appointments/new">Book</Link>
        <Link className="mb-sidebar__link" to="/profile">Profile</Link>
      </nav>

      <div className="mb-sidebar__footer">
        {user ? (
          <div className="mb-user">
            <div className="mb-user__meta">
              <span className="mb-user__name">{user.name}</span>
              <span className="mb-user__email">{user.email}</span>
            </div>
            <div className="mb-user__avatar" aria-hidden="true">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button type="button" className="mb-user__action" onClick={handleLogout} title="Logout" aria-label="Logout">
              ↘
            </button>
          </div>
        ) : (
          <Link className="btn btn-primary btn-sm w-100" to="/register">Register</Link>
        )}
      </div>
    </aside>
  );
}