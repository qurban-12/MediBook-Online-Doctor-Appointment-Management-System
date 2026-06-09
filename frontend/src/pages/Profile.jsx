import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [message, setMessage] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      updateProfile({ name, email, phone, address });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h1 className="h3 mb-3">Profile</h1>
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSave} className="card shadow-sm border-0 p-4">
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
        <button className="btn mt-3" type="submit" style={{ backgroundColor: '#001f3f', borderColor: '#001f3f', color: 'white' }}>Save Changes</button>
      </form>
    </div>
  );
}
