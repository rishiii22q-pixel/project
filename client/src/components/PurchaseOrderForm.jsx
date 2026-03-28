import { useState } from 'react';

const initial = { quotationId: '', issueDate: '', deliveryDate: '' };

export default function PurchaseOrderForm({ quotations, onCreated }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Could not create PO');
      }
      setForm(initial);
      setMessage('Purchase order created');
      onCreated?.();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Quotation
        <select name="quotationId" value={form.quotationId} onChange={handleChange} required>
          <option value="">Select quotation</option>
          {quotations.map((quote) => (
            <option key={quote.id} value={quote.id}>Quote #{quote.id} - ₹{quote.totalAmount}</option>
          ))}
        </select>
      </label>
      <label>
        Issue Date
        <input type="date" name="issueDate" value={form.issueDate} onChange={handleChange} required />
      </label>
      <label>
        Delivery Date
        <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange} />
      </label>
      <button type="submit">Create PO</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}
