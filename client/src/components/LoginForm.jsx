import { useState } from 'react';

const initial = { email: '', password: '' };

export default function LoginForm({ onLoggedIn }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        throw new Error(data.error || text || 'Login failed');
      }
      onLoggedIn(data);
      setMessage('Login successful');
      setForm(initial);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form className="form-grid card" onSubmit={handleSubmit}>
      <h3>Vendor / Admin Login</h3>
      <label>
        Email
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>
        Password
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
      </label>
      <div className="form-actions">
        <button type="submit">Login</button>
      </div>
      {message && <div className="message">{message}</div>}
    </form>
  );
}
