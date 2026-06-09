import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Handle profile update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
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
      setProfileMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update profile.' 
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setPasswordLoading(true);

    try {
      await api.patch('/users/password', {
        currentPassword,
        newPassword
      });
      
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to change password.' 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <h1 className="h3 mb-0">Profile</h1>
        <button 
          className="btn btn-outline-danger" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Update Profile Section */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h2 className="h5 mb-3">Update Profile Information</h2>
        {profileMessage && (
          <div className={`alert ${profileMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {profileMessage.text}
          </div>
        )}
        <form onSubmit={handleSaveProfile}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input 
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input 
              type="tel" 
              className="form-control" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="+1 (555) 123-4567" 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea 
              className="form-control" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="123 Main St, City, State 12345" 
              rows="3" 
            />
          </div>
          <button 
            className="btn mt-3" 
            type="submit" 
            disabled={profileLoading}
            style={{ backgroundColor: '#001f3f', borderColor: '#001f3f', color: 'white' }}
          >
            {profileLoading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 mb-0">Security</h2>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <>
            {passwordMessage && (
              <div className={`alert ${passwordMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                {passwordMessage.text}
              </div>
            )}
            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
              <button 
                className="btn" 
                type="submit" 
                disabled={passwordLoading}
                style={{ backgroundColor: '#001f3f', borderColor: '#001f3f', color: 'white' }}
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
