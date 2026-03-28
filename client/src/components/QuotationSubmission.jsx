import { useState } from 'react';

const initial = {
  rfqId: '',
  vendorId: '',
  validFrom: '',
  validUntil: '',
  totalAmount: '',
  terms: '',
  items: '',
};

export default function QuotationSubmission({ vendors, rfqs, onSubmitted }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      vendorId: Number(form.vendorId),
      rfqId: Number(form.rfqId),
      totalAmount: Number(form.totalAmount),
      items: form.items,
    };
    try {
      const res = await fetch('http://localhost:4000/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Could not submit quotation');
      }
      setForm(initial);
      onSubmitted?.();
      setMessage('Quotation submitted');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        RFQ
        <select name="rfqId" value={form.rfqId} onChange={handleChange} required>
          <option value="">Select RFQ</option>
          {rfqs.map((rfq) => (
            <option key={rfq.id} value={rfq.id}>{rfq.title}</option>
          ))}
        </select>
      </label>
      <label>
        Vendor
        <select name="vendorId" value={form.vendorId} onChange={handleChange} required>
          <option value="">Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>{vendor.companyName}</option>
          ))}
        </select>
      </label>
      <label>
        Valid From
        <input type="date" name="validFrom" value={form.validFrom} onChange={handleChange} required />
      </label>
      <label>
        Valid Until
        <input type="date" name="validUntil" value={form.validUntil} onChange={handleChange} required />
      </label>
      <label>
        Total Amount
        <input type="number" name="totalAmount" value={form.totalAmount} onChange={handleChange} required />
      </label>
      <label>
        Terms
        <textarea name="terms" value={form.terms} onChange={handleChange} rows="3" />
      </label>
      <label>
        Itemized Pricing
        <textarea name="items" value={form.items} onChange={handleChange} rows="3" placeholder="JSON or line items" />
      </label>
      <button type="submit">Submit Quotation</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}
