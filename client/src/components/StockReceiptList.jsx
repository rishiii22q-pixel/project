export default function StockReceiptList({ receipts }) {
  if (!receipts.length) {
    return <p>No stock receipts recorded yet.</p>;
  }

  return (
    <div className="list-grid">
      {receipts.map((receipt) => (
        <article key={receipt.id} className="card">
          <h3>Receipt #{receipt.id}</h3>
          <p><strong>PO ID:</strong> {receipt.purchaseOrderId}</p>
          <p><strong>Item:</strong> {receipt.itemName}</p>
          <p><strong>Quantity:</strong> {receipt.quantity}</p>
          <p><strong>Received:</strong> {receipt.receivedDate}</p>
          <p><strong>Quality:</strong> {receipt.qualityStatus}</p>
          <p><strong>Return:</strong> {receipt.returnStatus}</p>
        </article>
      ))}
    </div>
  );
}
