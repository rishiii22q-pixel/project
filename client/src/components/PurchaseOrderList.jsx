export default function PurchaseOrderList({ purchaseOrders, onApprove, onReject }) {
  if (!purchaseOrders.length) {
    return <p>No purchase orders yet.</p>;
  }

  return (
    <div className="list-grid">
      {purchaseOrders.map((po) => (
        <article key={po.id} className="card">
          <h3>PO #{po.id}</h3>
          <p><strong>Vendor:</strong> {po.vendor?.companyName}</p>
          <p><strong>RFQ:</strong> {po.rfq?.title}</p>
          <p><strong>Total:</strong> ₹{po.totalAmount}</p>
          <p><strong>Status:</strong> {po.status}</p>
          <p><strong>Issued:</strong> {po.issueDate}</p>
          <div className="action-row">
            {po.status === 'pending' && (
              <>
                <button type="button" onClick={() => onApprove(po.id)}>Approve</button>
                <button type="button" onClick={() => onReject(po.id)}>Reject</button>
              </>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
