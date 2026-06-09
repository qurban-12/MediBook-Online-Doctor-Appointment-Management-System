import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppNavbar from './components/AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDetails from './pages/DoctorDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route
            path="/appointments"
            element={(
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/appointments/new"
            element={(
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route path="/doctors/:id" element={<DoctorDetails />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;