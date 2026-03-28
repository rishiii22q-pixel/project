export default function RFQList({ rfqs }) {
  if (!rfqs.length) {
    return <p>No RFQs created yet.</p>;
  }

  return (
    <div className="list-grid">
      {rfqs.map((rfq) => (
        <article key={rfq.id} className="card">
          <h3>{rfq.title}</h3>
          <p>{rfq.description || 'No description'}</p>
          <p><strong>Category:</strong> {rfq.category}</p>
          <p><strong>Status:</strong> {rfq.status}</p>
          <p><strong>Due:</strong> {rfq.dueDate}</p>
          <p><strong>Quotes:</strong> {rfq.quotations?.length || 0}</p>
        </article>
      ))}
    </div>
  );
}
