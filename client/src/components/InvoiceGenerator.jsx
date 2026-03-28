import { useState } from 'react';

const initial = { purchaseOrderId: '', dueDate: '', paymentTerms: '30 days' };

export default function InvoiceGenerator({ purchaseOrders, onGenerated }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Could not generate invoice');
      }
      setForm(initial);
      setMessage('Invoice generated successfully');
      onGenerated?.();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Purchase Order
        <select name="purchaseOrderId" value={form.purchaseOrderId} onChange={handleChange} required>
          <option value="">Select PO</option>
          {purchaseOrders.map((po) => (
            <option key={po.id} value={po.id}>PO #{po.id} - ₹{po.totalAmount}</option>
          ))}
        </select>
      </label>
      <label>
        Due Date
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
      </label>
      <label>
        Payment Terms
        <input name="paymentTerms" value={form.paymentTerms} onChange={handleChange} />
      </label>
      <button type="submit">Generate Invoice</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}
