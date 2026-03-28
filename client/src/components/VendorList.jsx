export default function VendorList({ vendors }) {
  if (!vendors.length) {
    return <p>No vendors registered yet.</p>;
  }

  return (
    <div className="vendor-list">
      {vendors.map((vendor) => {
        let documentsCount = 0;
        try {
          documentsCount = vendor.documents ? JSON.parse(vendor.documents).length : 0;
        } catch {
          documentsCount = 0;
        }
        return (
          <article key={vendor.id} className="vendor-card">
            <h3>{vendor.companyName}</h3>
            <p><strong>Contact:</strong> {vendor.name}</p>
            <p><strong>Category:</strong> {vendor.category}</p>
            <p><strong>GST:</strong> {vendor.gstNumber || 'N/A'}</p>
            <p><strong>PAN:</strong> {vendor.panNumber || 'N/A'}</p>
            <p><strong>Status:</strong> {vendor.profileStatus}</p>
            <p><strong>Eval Score:</strong> {vendor.evaluationScore || 0}</p>
            <p><strong>Documents:</strong> {documentsCount}</p>
            {vendor.blacklistReason && <p><strong>Blacklist:</strong> {vendor.blacklistReason}</p>}
          </article>
        );
      })}
    </div>
  );
}
