import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container py-5">
      <div className="row align-items-center g-4">
        <div className="col-lg-7">
          <span className="badge text-bg-primary mb-3">Online Doctor Appointment Management</span>
          <h1 className="display-5 fw-bold text-primary">Book appointments faster with MediBook.</h1>
          <p className="lead text-secondary mt-3">
            Browse doctors, sign in securely, and manage your appointments in one place.
          </p>
          <div className="d-flex gap-3 mt-4">
            <Link className="btn btn-primary btn-lg" to="/doctors">Find Doctors</Link>
            <Link className="btn btn-outline-primary btn-lg" to="/register">Create Account</Link>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4">What you can do</h2>
              <ul className="list-unstyled mb-0 mt-3">
                <li className="mb-2">• Search doctors by specialization</li>
                <li className="mb-2">• Sign in and manage your account</li>
                <li className="mb-2">• Prepare for booking and follow-up flows</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}