import { useState } from 'react';

const initial = {
  vendorId: '',
  evaluationScore: '',
  preQualification: '',
  performanceReviews: '',
  profileStatus: 'active',
  blacklistReason: '',
};

export default function VendorEvaluation({ vendors, onUpdated }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vendorId) {
      setMessage('Select a vendor first');
      return;
    }
    try {
      const payload = {
        evaluationScore: Number(form.evaluationScore) || 0,
        preQualification: form.preQualification,
        performanceReviews: form.performanceReviews,
        profileStatus: form.profileStatus,
        blacklistReason: form.blacklistReason,
      };
      const res = await fetch(`http://localhost:4000/api/vendors/${form.vendorId}/evaluate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update vendor');
      }
      setMessage('Vendor evaluation updated');
      setForm(initial);
      onUpdated?.();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Vendor
        <select name="vendorId" value={form.vendorId} onChange={handleChange} required>
          <option value="">Select vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>{vendor.companyName}</option>
          ))}
        </select>
      </label>
      <label>
        Evaluation Score
        <input type="number" name="evaluationScore" value={form.evaluationScore} onChange={handleChange} min="0" max="100" />
      </label>
      <label>
        Pre-qualification
        <textarea name="preQualification" value={form.preQualification} onChange={handleChange} rows="3" />
      </label>
      <label>
        Performance Reviews
        <textarea name="performanceReviews" value={form.performanceReviews} onChange={handleChange} rows="3" />
      </label>
      <label>
        Profile Status
        <select name="profileStatus" value={form.profileStatus} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="blacklisted">Blacklisted</option>
        </select>
      </label>
      <label>
        Blacklist Reason
        <textarea name="blacklistReason" value={form.blacklistReason} onChange={handleChange} rows="2" />
      </label>
      <button type="submit">Update Vendor</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}
