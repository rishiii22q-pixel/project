export default function InvoiceList({ invoices, onPaid }) {
  if (!invoices.length) {
    return <p>No invoices generated yet.</p>;
  }

  return (
    <div className="list-grid">
      {invoices.map((invoice) => (
        <article key={invoice.id} className="card">
          <h3>Invoice #{invoice.id}</h3>
          <p><strong>Amount:</strong> ₹{invoice.amount}</p>
          <p><strong>GST:</strong> ₹{invoice.gst}</p>
          <p><strong>TDS:</strong> ₹{invoice.tds}</p>
          <p><strong>Total Payable:</strong> ₹{invoice.totalPayable}</p>
          <p><strong>Due Date:</strong> {invoice.dueDate}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          {invoice.status !== 'paid' && (
            <button type="button" onClick={() => onPaid(invoice.id)}>Mark Paid</button>
          )}
        </article>
      ))}
    </div>
  );
}
