import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

function Home() { return <div className="container mt-5"><h1>Welcome to MediBook</h1></div>; }
function DoctorsList() { return <div className="container mt-5"><h1>Our Doctors</h1></div>; }

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Bootstrap Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary text-white">
          <div className="container">
            <Link className="navbar-brand text-white fw-bold" to="/">MediBook</Link>
            <div className="navbar-nav ms-auto">
              <Link className="nav-link text-white" to="/">Home</Link>
              <Link className="nav-link text-white" to="/doctors">Find a Doctor</Link>
              <Link className="nav-link text-white" to="/login">Login</Link>
              <Link className="nav-link text-white bg-dark rounded px-3 ms-2" to="/register">Register</Link>
            </div>
          </div>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<DoctorsList />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;