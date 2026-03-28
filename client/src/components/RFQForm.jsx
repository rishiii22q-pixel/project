import { useState } from 'react';

const initial = {
  title: '',
  description: '',
  category: 'raw material',
  dueDate: '',
  budgetEstimate: '',
};

export default function RFQForm({ onCreated }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, budgetEstimate: Number(form.budgetEstimate), status: 'open' };
    try {
      const res = await fetch('http://localhost:4000/api/rfqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Could not create RFQ');
      }
      setForm(initial);
      setMessage('RFQ opened successfully');
      onCreated?.();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        RFQ Title
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>
      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
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
        Due Date
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
      </label>
      <label>
        Budget Estimate
        <input type="number" name="budgetEstimate" value={form.budgetEstimate} onChange={handleChange} />
      </label>
      <button type="submit">Create RFQ</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}
