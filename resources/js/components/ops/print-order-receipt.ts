export interface PrintOrderReceiptProps {
    orderNumber: string;
    createdAt: string;
    customer: {
        name: string;
        phone?: string | null;
        email?: string | null;
    } | null;
    items: Array<{
        name: string;
        quantity: number;
        unitPrice: string;
        total: string;
    }>;
    paymentMethod?: string;
    paymentStatus?: string;
    subtotal: string;
    deliveryFee?: string;
    tax?: string;
    discount?: string;
    total: string;
    paidAmount?: string;
    balanceDue?: string;
    notes?: string | null;
    company?: {
        name?: string;
        address?: string;
        city?: string;
        country?: string;
        phone?: string;
        email?: string;
    };
}

export function printOrderReceipt({
    orderNumber,
    createdAt,
    customer,
    items,
    paymentMethod,
    paymentStatus,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    paidAmount,
    balanceDue,
    notes,
    company,
}: PrintOrderReceiptProps): void {
    const companyName = company?.name ?? 'MaMa Café & Boba Tea';
    const companyAddress =
        [company?.address, company?.city, company?.country]
            .filter(Boolean)
            .join(', ') || 'Mogadishu, Somalia';
    const companyPhone = company?.phone ?? '+252 61 555 0101';
    const companyEmail = company?.email ?? '';

    const frameId = 'print-order-receipt-frame';
    let printFrame = document.getElementById(frameId) as HTMLIFrameElement | null;

    if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = frameId;
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);
    }

    const normalizedStatus = (paymentStatus || 'pending').toLowerCase();
    const statusClass =
        normalizedStatus === 'paid'
            ? 'paid'
            : normalizedStatus === 'unpaid'
              ? 'unpaid'
              : 'pending';

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Receipt - ${orderNumber}</title>
    <style>
        * { box-sizing: border-box; }
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            color: #1a1a1a;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        body {
            padding: 28px 36px;
        }
        .receipt-wrapper {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 16px;
            margin-bottom: 18px;
        }
        .company-info h1 {
            font-size: 22px;
            font-weight: 800;
            margin: 0 0 4px 0;
            color: #111827;
        }
        .company-info p {
            margin: 2px 0;
            font-size: 12px;
            color: #4b5563;
        }
        .meta-info {
            text-align: right;
        }
        .receipt-title {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 0.05em;
            color: #111827;
            margin: 0 0 4px 0;
        }
        .receipt-date {
            font-size: 12px;
            color: #4b5563;
            margin-bottom: 6px;
        }
        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        .badge.paid { background: #dcfce7; color: #15803d; }
        .badge.unpaid { background: #fee2e2; color: #b91c1c; }
        .badge.pending { background: #fef3c7; color: #b45309; }
        
        .details-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            margin: 16px 0 20px 0;
            padding: 12px 16px;
            background: #f9fafb;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        .detail-card span:first-child {
            display: block;
            font-size: 10.5px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #6b7280;
            margin-bottom: 3px;
        }
        .detail-card span:last-child {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #111827;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 18px 0;
        }
        th {
            text-align: left;
            font-size: 11px;
            color: #4b5563;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 8px 12px;
            border-bottom: 2px solid #e5e7eb;
            background: #f9fafb;
        }
        th.right { text-align: right; }
        th.center { text-align: center; }
        td {
            padding: 10px 12px;
            font-size: 13px;
            border-bottom: 1px solid #f3f4f6;
        }
        td.right { text-align: right; }
        td.center { text-align: center; }
        .item-title {
            font-weight: 600;
            color: #111827;
        }
        
        .summary-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 14px;
        }
        .summary-card {
            width: 360px;
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            font-size: 13px;
        }
        .summary-row span:first-child { color: #4b5563; }
        .summary-row span:last-child { font-weight: 600; }
        .total-row {
            font-size: 16px;
            font-weight: 800;
            padding: 8px 0;
            border-top: 1.5px solid #e5e7eb;
            border-bottom: 1.5px solid #e5e7eb;
            margin: 6px 0;
            display: flex;
            justify-content: space-between;
            color: #111827;
        }
        .paid-row { display: flex; justify-content: space-between; padding: 3px 0; color: #16a34a; font-weight: 600; }
        .balance-row { display: flex; justify-content: space-between; padding: 3px 0; font-weight: 600; }
        .balance-row.due { color: #dc2626; }
        .balance-row.zero { color: #16a34a; }
        
        .notes-section {
            margin-top: 24px;
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
        }
        .notes-section h4 {
            margin: 0 0 4px 0;
            font-size: 10.5px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
        }
        .notes-section p {
            margin: 0;
            font-size: 12px;
            color: #4b5563;
        }
        
        .footer {
            text-align: center;
            font-size: 11.5px;
            color: #6b7280;
            margin-top: 30px;
            padding-top: 14px;
            border-top: 1px solid #e5e7eb;
        }
        
        @media print {
            body {
                padding: 10mm 15mm !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
            }
            .receipt-wrapper {
                width: 100% !important;
                max-width: 100% !important;
            }
            @page {
                size: auto;
                margin: 10mm;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-wrapper">
        <div class="header">
            <div class="company-info">
                <h1>${companyName}</h1>
                <p>${companyAddress} · ${companyPhone}</p>
                ${companyEmail ? `<p>${companyEmail}</p>` : ''}
            </div>
            <div class="meta-info">
                <div class="receipt-title">RECEIPT</div>
                <div class="receipt-date">${createdAt}</div>
                <div class="badge ${statusClass}">${paymentStatus?.toUpperCase() || 'PENDING'}</div>
            </div>
        </div>

        <div class="details-grid">
            <div class="detail-card">
                <span>Order #</span>
                <span>${orderNumber}</span>
            </div>
            <div class="detail-card">
                <span>Customer / Staff</span>
                <span>${customer ? customer.name : 'Walk-in'}</span>
            </div>
            <div class="detail-card">
                <span>Payment Method</span>
                <span style="text-transform: capitalize;">${paymentMethod ? paymentMethod.replace('_', ' ') : 'Cash'}</span>
            </div>
            <div class="detail-card">
                <span>Status</span>
                <span style="text-transform: capitalize;">${paymentStatus || 'Pending'}</span>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th class="center" style="width: 80px;">Qty</th>
                    <th class="right" style="width: 120px;">Price</th>
                    <th class="right" style="width: 140px;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${items
                    .map(
                        (item) => `
                <tr>
                    <td class="item-title">${item.name}</td>
                    <td class="center font-mono">${item.quantity}</td>
                    <td class="right font-mono">${item.unitPrice}</td>
                    <td class="right font-mono" style="font-weight: 600;">${item.total}</td>
                </tr>
                `
                    )
                    .join('')}
            </tbody>
        </table>

        <div class="summary-container">
            <div class="summary-card">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span class="font-mono">${subtotal}</span>
                </div>
                ${deliveryFee ? `<div class="summary-row"><span>Delivery Fee</span><span class="font-mono">${deliveryFee}</span></div>` : ''}
                ${tax ? `<div class="summary-row"><span>Tax</span><span class="font-mono">${tax}</span></div>` : ''}
                ${discount ? `<div class="summary-row"><span>Discount</span><span class="font-mono" style="color: #dc2626;">-${discount}</span></div>` : ''}
                <div class="total-row">
                    <span>Total</span>
                    <span class="font-mono">${total}</span>
                </div>
                ${paidAmount ? `<div class="paid-row"><span>Paid</span><span class="font-mono">${paidAmount}</span></div>` : ''}
                ${balanceDue ? `<div class="balance-row ${balanceDue !== '$0.00' && balanceDue !== '0' ? 'due' : 'zero'}"><span>Balance Due</span><span class="font-mono">${balanceDue}</span></div>` : ''}
            </div>
        </div>

        ${
            notes
                ? `
        <div class="notes-section">
            <h4>Notes</h4>
            <p>${notes}</p>
        </div>
        `
                : ''
        }

        <div class="footer">
            <p>Thank you for your business! · ${companyName}</p>
        </div>
    </div>
</body>
</html>`;

    const doc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        setTimeout(() => {
            printFrame?.contentWindow?.focus();
            printFrame?.contentWindow?.print();
        }, 250);
    }
}
