import { useEffect, useState } from 'react';
import VendorRegistration from './components/VendorRegistration.jsx';
import VendorList from './components/VendorList.jsx';
import VendorEvaluation from './components/VendorEvaluation.jsx';
import VendorDocumentUpload from './components/VendorDocumentUpload.jsx';
import RFQForm from './components/RFQForm.jsx';
import RFQList from './components/RFQList.jsx';
import QuotationSubmission from './components/QuotationSubmission.jsx';
import QuotationComparison from './components/QuotationComparison.jsx';
import PurchaseOrderForm from './components/PurchaseOrderForm.jsx';
import PurchaseOrderList from './components/PurchaseOrderList.jsx';
import InvoiceGenerator from './components/InvoiceGenerator.jsx';
import InvoiceList from './components/InvoiceList.jsx';
import StockReceiptForm from './components/StockReceiptForm.jsx';
import StockReceiptList from './components/StockReceiptList.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';

function App() {
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('authUser')) || null;
    } catch {
      return null;
    }
  });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');
  const [vendors, setVendors] = useState([]);
  const [rfqs, setRFQs] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getHeaders = (includeJson = true) => {
    const headers = {};
    if (includeJson) headers['Content-Type'] = 'application/json';
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    return headers;
  };

  const loadAll = async () => {
    try {
      const [vendorRes, rfqRes, quoteRes, poRes, invoiceRes, receiptRes] = await Promise.all([
        fetch('http://localhost:4000/api/vendors', { headers: getHeaders() }),
        fetch('http://localhost:4000/api/rfqs', { headers: getHeaders() }),
        fetch('http://localhost:4000/api/quotations', { headers: getHeaders() }),
        fetch('http://localhost:4000/api/purchase-orders', { headers: getHeaders() }),
        fetch('http://localhost:4000/api/invoices', { headers: getHeaders() }),
        fetch('http://localhost:4000/api/inventory', { headers: getHeaders() }),
      ]);
      setVendors(await vendorRes.json());
      setRFQs(await rfqRes.json());
      setQuotations(await quoteRes.json());
      setPurchaseOrders(await poRes.json());
      setInvoices(await invoiceRes.json());
      setReceipts(await receiptRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authUser) {
      loadAll();
    }
  }, [refresh, authUser]);

  const refreshAll = () => setRefresh((prev) => !prev);

  const handleAuth = (data) => {
    if (data?.token && data?.user) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      setAuthToken(data.token);
      setAuthUser(data.user);
      setTimeout(refreshAll, 0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthUser(null);
    setAuthToken('');
  };

  const handleApprovePO = async (id) => {
    await fetch(`http://localhost:4000/api/purchase-orders/${id}/approve`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ signature: 'Procurement Head' }) });
    refreshAll();
  };

  const handleRejectPO = async (id) => {
    await fetch(`http://localhost:4000/api/purchase-orders/${id}/reject`, { method: 'PATCH', headers: getHeaders() });
    refreshAll();
  };

  const handleMarkPaid = async (id) => {
    await fetch(`http://localhost:4000/api/invoices/${id}/pay`, { method: 'PATCH', headers: getHeaders() });
    refreshAll();
  };

  if (!authUser) {
    return (
      <div className="app-shell">
        <header>
          <h1>Vendor Management Portal - Login</h1>
        </header>
        <main>
          <section className="panel">
            <LoginForm onLoggedIn={handleAuth} />
          </section>
          <section className="panel">
            <RegisterForm onRegistered={handleAuth} />
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header>
        <div className="header-row">
          <h1>Procurement Management System</h1>
          <div>
            <span>Signed in as {authUser.email}</span>
            <button type="button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>
      <main>
        <section className="panel">
          <h2>Vendor Management</h2>
          <VendorRegistration onRegistered={refreshAll} />
          <VendorEvaluation vendors={vendors} onUpdated={refreshAll} />
          <VendorDocumentUpload vendors={vendors} onUploaded={refreshAll} />
          <VendorList vendors={vendors} />
        </section>

        <section className="panel">
          <h2>RFQ Management</h2>
          <RFQForm onCreated={refreshAll} />
          <RFQList rfqs={rfqs} />
        </section>

        <section className="panel">
          <h2>Quotation Management</h2>
          <QuotationSubmission vendors={vendors} rfqs={rfqs} onSubmitted={refreshAll} />
          <QuotationComparison rfqs={rfqs} onRefresh={refreshAll} />
        </section>

        <section className="panel">
          <h2>Purchase Order Management</h2>
          <PurchaseOrderForm quotations={quotations} onCreated={refreshAll} />
          <PurchaseOrderList purchaseOrders={purchaseOrders} onApprove={handleApprovePO} onReject={handleRejectPO} />
        </section>

        <section className="panel">
          <h2>Invoice Generation</h2>
          <InvoiceGenerator purchaseOrders={purchaseOrders} onGenerated={refreshAll} />
          <InvoiceList invoices={invoices} onPaid={handleMarkPaid} />
        </section>

        <section className="panel">
          <h2>Inventory & Stock Receipt</h2>
          <StockReceiptForm purchaseOrders={purchaseOrders} onCreated={refreshAll} />
          <StockReceiptList receipts={receipts} />
        </section>
      </main>
    </div>
  );
}

export default App;
