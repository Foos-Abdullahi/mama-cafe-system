import { formatCurrency } from '@/lib/utils';

export interface PrintInvoiceProps {
    orderNumber: string;
    createdAt: string;
    customer: {
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
    } | null;
    items: Array<{
        name: string;
        unit?: string;
        quantity: number;
        unit_price: number;
        line_total: number;
    }>;
    paymentMethod: string | null;
    paymentStatus: string;
    paymentPhone?: string | null;
    subtotal: number;
    discountAmount: number;
    discountType?: string;
    taxAmount: number;
    shippingAmount?: number;
    grandTotal: number;
    paidAmount: number;
    balanceDue: number;
    notes: string | null;
    company?: {
        name?: string;
        address?: string;
        city?: string;
        country?: string;
        phone?: string;
        email?: string;
    };
}

export function printInvoice({
    orderNumber,
    createdAt,
    customer,
    items,
    paymentMethod,
    paymentStatus,
    paymentPhone,
    subtotal,
    discountAmount,
    discountType = 'fixed',
    taxAmount,
    shippingAmount = 0,
    grandTotal,
    paidAmount,
    balanceDue,
    notes,
    company,
}: PrintInvoiceProps): void {
    const companyName = company?.name ?? 'MaMa Café & Boba Tea';
    const companyAddress =
        [company?.address, company?.city, company?.country]
            .filter(Boolean)
            .join(', ') || 'Mogadishu, Somalia';
    const companyPhone = company?.phone ?? '+252 61 555 0101';
    const companyEmail = company?.email ?? '';

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        const dateStr = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${dateStr} · ${timeStr}`;
    };

    const frameId = 'print-invoice-frame';
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
    <title>Invoice - ${orderNumber}</title>
    <style>
        * { box-sizing: border-box; }
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            color: #1a1a1a;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13.5px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        body {
            padding: 32px 40px;
        }
        .invoice-wrapper {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .company-info h1 {
            font-size: 26px;
            font-weight: 800;
            margin: 0 0 4px 0;
            color: #111827;
            letter-spacing: -0.02em;
        }
        .company-info p {
            margin: 2px 0;
            font-size: 12.5px;
            color: #4b5563;
        }
        .meta-info {
            text-align: right;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.05em;
            color: #111827;
            margin: 0 0 4px 0;
        }
        .invoice-date {
            font-size: 12.5px;
            color: #4b5563;
            margin-bottom: 6px;
        }
        .badge {
            display: inline-block;
            padding: 3px 12px;
            border-radius: 4px;
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
            gap: 16px;
            margin: 18px 0 24px 0;
            padding: 14px 18px;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .detail-card span:first-child {
            display: block;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #6b7280;
            margin-bottom: 3px;
        }
        .detail-card span:last-child {
            display: block;
            font-size: 13.5px;
            font-weight: 600;
            color: #111827;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th {
            text-align: left;
            font-size: 11px;
            color: #4b5563;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 10px 12px;
            border-bottom: 2px solid #e5e7eb;
            background: #f9fafb;
        }
        th.right { text-align: right; }
        th.center { text-align: center; }
        td {
            padding: 11px 12px;
            font-size: 13px;
            border-bottom: 1px solid #f3f4f6;
        }
        td.right { text-align: right; }
        td.center { text-align: center; }
        .item-title {
            font-weight: 600;
            color: #111827;
        }
        .sub-text {
            font-size: 10.5px;
            color: #9ca3af;
            display: block;
        }
        
        .summary-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 16px;
        }
        .summary-card {
            width: 380px;
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 13px;
        }
        .summary-row span:first-child { color: #4b5563; }
        .summary-row span:last-child { font-weight: 600; }
        .total-row {
            font-size: 16.5px;
            font-weight: 800;
            padding: 9px 0;
            border-top: 2px solid #e5e7eb;
            border-bottom: 2px solid #e5e7eb;
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
            margin-top: 28px;
            border-top: 1px solid #e5e7eb;
            padding-top: 14px;
        }
        .notes-section h4 {
            margin: 0 0 4px 0;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
        }
        .notes-section p {
            margin: 0;
            font-size: 12.5px;
            color: #4b5563;
        }
        
        .footer {
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            margin-top: 36px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
        }
        
        @media print {
            body {
                padding: 10mm 15mm !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
            }
            .invoice-wrapper {
                width: 100% !important;
                max-width: 100% !important;
            }
            .no-print { display: none !important; }
            @page {
                size: auto;
                margin: 10mm;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-wrapper">
        <div class="header">
            <div class="company-info">
                <h1>${companyName}</h1>
                <p>${companyAddress} · ${companyPhone}</p>
                ${companyEmail ? `<p>${companyEmail}</p>` : ''}
            </div>
            <div class="meta-info">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-date">${formatDate(createdAt)}</div>
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
                <span>Payment Status</span>
                <span style="text-transform: capitalize;">${paymentStatus}</span>
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
                    <td>
                        <span class="item-title">${item.name}</span>
                        ${item.unit ? `<span class="sub-text">per ${item.unit}</span>` : ''}
                    </td>
                    <td class="center font-mono">${item.quantity}</td>
                    <td class="right font-mono">${formatCurrency(item.unit_price)}</td>
                    <td class="right font-mono" style="font-weight: 600;">${formatCurrency(item.line_total)}</td>
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
                    <span class="font-mono">${formatCurrency(subtotal)}</span>
                </div>
                ${
                    discountAmount > 0
                        ? `
                <div class="summary-row">
                    <span>Discount (${discountType === 'percentage' ? discountAmount + '%' : formatCurrency(discountAmount)})</span>
                    <span class="font-mono" style="color: #dc2626;">-${formatCurrency(discountAmount)}</span>
                </div>
                `
                        : ''
                }
                ${
                    taxAmount > 0
                        ? `
                <div class="summary-row">
                    <span>Tax</span>
                    <span class="font-mono">${formatCurrency(taxAmount)}</span>
                </div>
                `
                        : ''
                }
                ${
                    shippingAmount > 0
                        ? `
                <div class="summary-row">
                    <span>Shipping</span>
                    <span class="font-mono">${formatCurrency(shippingAmount)}</span>
                </div>
                `
                        : ''
                }
                <div class="total-row">
                    <span>Total</span>
                    <span class="font-mono">${formatCurrency(grandTotal)}</span>
                </div>
                <div class="paid-row">
                    <span>Paid</span>
                    <span class="font-mono">${formatCurrency(paidAmount)}</span>
                </div>
                <div class="balance-row ${balanceDue > 0 ? 'due' : 'zero'}">
                    <span>Balance Due</span>
                    <span class="font-mono">${formatCurrency(balanceDue)}</span>
                </div>
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

export { printOrderReceipt } from './print-order-receipt';
export type { PrintOrderReceiptProps } from './print-order-receipt';
