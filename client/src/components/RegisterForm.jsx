import { useState } from 'react';

const initial = {
  email: '',
  password: '',
  name: '',
  companyName: '',
  category: 'raw material',
  gstNumber: '',
  panNumber: '',
  bankAccount: '',
  ifsc: '',
  phone: '',
};

export default function RegisterForm({ onRegistered }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        throw new Error(data.error || text || 'Registration failed');
      }
      onRegistered(data);
      setMessage('Registration successful');
      setForm(initial);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form className="form-grid card" onSubmit={handleSubmit}>
      <h3>Vendor Self Registration</h3>
      <div className="form-columns">
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
      </div>
      <div className="form-columns">
        <label>
          Contact Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Company Name
          <input name="companyName" value={form.companyName} onChange={handleChange} required />
        </label>
      </div>
      <div className="form-columns">
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="raw material">Raw Material</option>
            <option value="services">Services</option>
            <option value="equipment">Equipment</option>
            <option value="logistics">Logistics</option>
          </select>
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>
      </div>
      <div className="form-columns">
        <label>
          GST Number
          <input name="gstNumber" value={form.gstNumber} onChange={handleChange} />
        </label>
        <label>
          PAN Number
          <input name="panNumber" value={form.panNumber} onChange={handleChange} />
        </label>
      </div>
      <div className="form-columns">
        <label>
          Bank Account
          <input name="bankAccount" value={form.bankAccount} onChange={handleChange} />
        </label>
        <label>
          IFSC
          <input name="ifsc" value={form.ifsc} onChange={handleChange} />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit">Register</button>
      </div>
      {message && <div className="message">{message}</div>}
    </form>
  );
}
