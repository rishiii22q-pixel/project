import { useState } from 'react';

const initialState = {
  name: '',
  companyName: '',
  category: 'raw material',
  gstNumber: '',
  panNumber: '',
  bankAccount: '',
  ifsc: '',
  email: '',
  phone: '',
};

export default function VendorRegistration({ onRegistered }) {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create vendor');
      }
      setMessage('Vendor added successfully');
      setForm(initialState);
      onRegistered?.();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Vendor Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Company Name
        <input name="companyName" value={form.companyName} onChange={handleChange} required />
      </label>
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
        GST Number
        <input name="gstNumber" value={form.gstNumber} onChange={handleChange} />
      </label>
      <label>
        PAN Number
        <input name="panNumber" value={form.panNumber} onChange={handleChange} />
      </label>
      <label>
        Bank Account
        <input name="bankAccount" value={form.bankAccount} onChange={handleChange} />
      </label>
      <label>
        IFSC
        <input name="ifsc" value={form.ifsc} onChange={handleChange} />
      </label>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} />
      </label>
      <label>
        Phone
        <input name="phone" value={form.phone} onChange={handleChange} />
      </label>
      <button type="submit">Create Vendor</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}
