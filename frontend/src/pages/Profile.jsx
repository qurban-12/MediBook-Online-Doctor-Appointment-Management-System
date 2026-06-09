import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Update State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSubmitting(true);
    setProfileMessage(null);

    try {
      const response = await api.put('/users/profile', {
        name,
        email,
        phone,
        address
      });
      updateProfile(response.data.user);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordSubmitting(true);
    setPasswordMessage(null);

    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'All password fields are required.' });
      setPasswordSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      setPasswordSubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      setPasswordSubmitting(false);
      return;
    }

    try {
      await api.patch('/users/password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h1 className="h3 mb-5">Profile</h1>

      {/* Update Profile Section */}
      <div className="mb-5">
        <h2 className="h5 mb-3">Update Profile</h2>
        {profileMessage && (
          <div className={`alert ${profileMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {profileMessage.text}
          </div>
        )}
        <form onSubmit={handleProfileSave} className="card shadow-sm border-0 p-4">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City, State 12345" rows="3" />
          </div>
          <button className="btn mt-3" type="submit" disabled={profileSubmitting} style={{ backgroundColor: '#001f3f', borderColor: '#001f3f', color: 'white' }}>
            {profileSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="mb-5">
        <h2 className="h5 mb-3">Change Password</h2>
        {passwordMessage && (
          <div className={`alert ${passwordMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {passwordMessage.text}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="card shadow-sm border-0 p-4">
          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm New Password</label>
            <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button className="btn mt-3" type="submit" disabled={passwordSubmitting} style={{ backgroundColor: '#001f3f', borderColor: '#001f3f', color: 'white' }}>
            {passwordSubmitting ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Logout Section */}
      <div className="mb-5">
        <h2 className="h5 mb-3">Account</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
