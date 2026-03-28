# Database Schema & ER Diagram

## Entities

- `Vendor`
  - Vendor registration, profile, GST/PAN, bank details, category, rating, evaluation score, blacklist status
- `RFQ`
  - Request for quotation with category, timeline, description, and budget estimate
- `Quotation`
  - Vendor quote submitted against an RFQ, with item pricing, validity, and terms
- `PurchaseOrder`
  - Purchase order created from selected quotation, with approval and signature workflow
- `Invoice`
  - Invoice generated from Purchase Order, with GST, TDS, payment terms, and status
- `StockReceipt`
  - Inventory receipt recorded against a PO, with quantity, quality status, and return tracking

## ER Diagram

```mermaid
erDiagram
    VENDOR ||--o{ QUOTATION : submits
    RFQ ||--o{ QUOTATION : receives
    RFQ ||--o{ PURCHASE_ORDER : generates
    QUOTATION ||--o{ PURCHASE_ORDER : selected_from
    PURCHASE_ORDER ||--o{ INVOICE : generates
    PURCHASE_ORDER ||--o{ STOCK_RECEIPT : receives

    VENDOR {
        integer id PK
        string name
        string companyName
        string category
        string gstNumber
        string panNumber
        string bankAccount
        string ifsc
        float rating
        float evaluationScore
        text preQualification
        text performanceReviews
        string profileStatus
    }
    RFQ {
        integer id PK
        string title
        text description
        string category
        date dueDate
        string status
        float budgetEstimate
    }
    QUOTATION {
        integer id PK
        integer vendorId FK
        integer rfqId FK
        text specifications
        date validFrom
        date validUntil
        float totalAmount
        text terms
        string status
        text items
    }
    PURCHASE_ORDER {
        integer id PK
        integer rfqId FK
        integer quotationId FK
        integer vendorId FK
        date issueDate
        date deliveryDate
        float totalAmount
        string status
        string signature
    }
    INVOICE {
        integer id PK
        integer purchaseOrderId FK
        float amount
        float gst
        float tds
        float totalPayable
        date dueDate
        string status
    }
    STOCK_RECEIPT {
        integer id PK
        integer purchaseOrderId FK
        string itemName
        integer quantity
        date receivedDate
        string qualityStatus
        string returnStatus
    }
```

## Notes
- The implementation uses SQLite for local setup and quick iteration.
- The schema supports procurement lifecycle from vendor onboarding to invoice and inventory receipt.
