import { useState } from 'react';

export default function QuotationComparison({ rfqs, onRefresh }) {
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleCompare = async () => {
    if (!selected) {
      setMessage('Choose an RFQ to compare');
      return;
    }
    setMessage('');
    const res = await fetch(`http://localhost:4000/api/quotations/compare/${selected}`);
    if (!res.ok) {
      const error = await res.json();
      setMessage(error.error || 'Failed to compare');
      return;
    }
    const data = await res.json();
    setResult(data);
    onRefresh?.();
  };

  return (
    <div className="compare-section">
      <label>
        Pick RFQ for comparison
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select RFQ</option>
          {rfqs.map((rfq) => (
            <option key={rfq.id} value={rfq.id}>{rfq.title}</option>
          ))}
        </select>
      </label>
      <button type="button" onClick={handleCompare}>Compare Quotes</button>
      {message && <div className="message">{message}</div>}
      {result && (
        <div className="comparison-result">
          <h4>Recommendation</h4>
          <p><strong>Lowest Total:</strong> ₹{result.recommendation?.totalAmount}</p>
          <p><strong>Vendor:</strong> {result.recommendation?.vendor?.companyName}</p>
          <div className="list-grid">
            {result.quotes.map((quote) => (
              <article key={quote.id} className="card">
                <h4>{quote.vendor?.companyName}</h4>
                <p><strong>Total:</strong> ₹{quote.totalAmount}</p>
                <p><strong>Status:</strong> {quote.status}</p>
                <p><strong>Valid until:</strong> {quote.validUntil}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
