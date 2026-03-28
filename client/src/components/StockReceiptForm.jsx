import { useState } from 'react';

const initial = { purchaseOrderId: '', itemName: '', quantity: '', receivedDate: '', remarks: '' };

export default function StockReceiptForm({ purchaseOrders, onCreated }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Could not create stock receipt');
      }
      setForm(initial);
      setMessage('Stock receipt created');
      onCreated?.();
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
            <option key={po.id} value={po.id}>PO #{po.id}</option>
          ))}
        </select>
      </label>
      <label>
        Item Name
        <input name="itemName" value={form.itemName} onChange={handleChange} required />
      </label>
      <label>
        Quantity
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
      </label>
      <label>
        Received Date
        <input type="date" name="receivedDate" value={form.receivedDate} onChange={handleChange} required />
      </label>
      <label>
        Remarks
        <textarea name="remarks" value={form.remarks} onChange={handleChange} rows="3" />
      </label>
      <button type="submit">Record Receipt</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}
