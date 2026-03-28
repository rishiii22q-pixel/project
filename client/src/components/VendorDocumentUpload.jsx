import { useState } from 'react';

export default function VendorDocumentUpload({ vendors, onUploaded }) {
  const [vendorId, setVendorId] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorId || !file) {
      setMessage('Select vendor and document');
      return;
    }
    const formData = new FormData();
    formData.append('document', file);
    try {
      const res = await fetch(`http://localhost:4000/api/vendors/${vendorId}/documents`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }
      setMessage('Document uploaded successfully');
      setFile(null);
      onUploaded?.();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit} encType="multipart/form-data">
      <label>
        Vendor
        <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} required>
          <option value="">Select vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>{vendor.companyName}</option>
          ))}
        </select>
      </label>
      <label>
        Document
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
      </label>
      <button type="submit">Upload Document</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}
