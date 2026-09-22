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
        printFrame.style.position = 'absolute';
        printFrame.style.left = '-9999px';
        printFrame.style.top = '-9999px';
        printFrame.style.width = '300px';
        printFrame.style.height = '400px';
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
            background: #ffffff;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #1a1a1a;
            font-size: 13px;
            line-height: 1.4;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
        }
        .page-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 20px 0;
        }
        .receipt-card {
            width: 100%;
            max-width: 380px;
            margin: 0 auto;
            padding: 0 16px;
        }
        .header { text-align: center; margin-bottom: 14px; }
        .header h1 { font-size: 18px; font-weight: 700; margin: 0 0 4px 0; color: #111827; }
        .header p { margin: 2px 0; font-size: 11.5px; color: #4b5563; }
        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 9999px;
            font-size: 10.5px;
            font-weight: 700;
            margin-top: 8px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        .badge.paid { background: #dcfce7; color: #15803d; }
        .badge.unpaid { background: #fee2e2; color: #b91c1c; }
        .badge.pending { background: #fef3c7; color: #b45309; }
        .details { margin: 12px 0; font-size: 12.5px; }
        .details-row { display: flex; justify-content: space-between; padding: 2.5px 0; }
        .details-row span:first-child { color: #6b7280; }
        .details-row span:last-child { font-weight: 600; color: #111827; }
        table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        th {
            text-align: left;
            font-size: 11px;
            color: #4b5563;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.04em;
            padding: 6px 4px;
            border-bottom: 2px solid #e5e7eb;
        }
        th.right { text-align: right; }
        td { padding: 6px 4px; font-size: 12.5px; border-bottom: 1px solid #f3f4f6; }
        td.right { text-align: right; }
        .item-name { font-weight: 600; color: #111827; }
        .summary { border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 8px; font-size: 12.5px; }
        .summary-row { display: flex; justify-content: space-between; padding: 2.5px 0; }
        .summary-row span:first-child { color: #6b7280; }
        .summary-row span:last-child { font-weight: 500; }
        .total-row {
            font-size: 15px;
            font-weight: 700;
            padding: 6px 0 3px;
            border-top: 1.5px solid #e5e7eb;
            margin-top: 5px;
            display: flex;
            justify-content: space-between;
            color: #111827;
        }
        .paid-row { display: flex; justify-content: space-between; padding: 2px 0; color: #15803d; font-weight: 600; }
        .balance-row { display: flex; justify-content: space-between; padding: 2px 0; font-weight: 600; }
        .balance-row.due { color: #b91c1c; }
        .balance-row.zero { color: #15803d; }
        .notes { margin-top: 12px; padding-top: 8px; border-top: 1px solid #e5e7eb; }
        .notes p { font-size: 11.5px; color: #4b5563; margin: 0; }
        .footer {
            text-align: center;
            font-size: 11.5px;
            color: #6b7280;
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
        }
        hr { border: none; border-top: 1px solid #e5e7eb; margin: 10px 0; }
        @media print {
            html, body {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: flex-start !important;
            }
            .page-container {
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
                align-items: flex-start !important;
                margin: 0 auto !important;
                padding: 0 !important;
            }
            .receipt-card {
                width: 100% !important;
                max-width: 380px !important;
                margin: 0 auto !important;
                padding: 0 !important;
            }
            @page {
                margin: 8mm auto;
                size: auto;
            }
        }
    </style>
</head>
<body>
    <div class="page-container">
        <div class="receipt-card">
            <div class="header">
                <h1>${companyName}</h1>
                <p>${companyAddress} · ${companyPhone}</p>
                ${companyEmail ? `<p>${companyEmail}</p>` : ''}
                <p>${createdAt}</p>
                <div class="badge ${statusClass}">${paymentStatus?.toUpperCase() || 'PENDING'}</div>
            </div>

            <hr />

            <div class="details">
                <div class="details-row">
                    <span>Order #</span>
                    <span>${orderNumber}</span>
                </div>
                ${
                    customer
                        ? `
                <div class="details-row">
                    <span>Customer / Staff</span>
                    <span>${customer.name}</span>
                </div>
                ${customer.phone ? `<div class="details-row"><span>Phone</span><span>${customer.phone}</span></div>` : ''}
                `
                        : ''
                }
                ${
                    paymentMethod
                        ? `
                <div class="details-row">
                    <span>Payment Method</span>
                    <span style="text-transform: capitalize;">${paymentMethod.replace('_', ' ')}</span>
                </div>
                `
                        : ''
                }
            </div>

            <hr />

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th class="right">Qty</th>
                        <th class="right">Price</th>
                        <th class="right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items
                        .map(
                            (item) => `
                    <tr>
                        <td class="item-name">${item.name}</td>
                        <td class="right">${item.quantity}</td>
                        <td class="right">${item.unitPrice}</td>
                        <td class="right" style="font-weight: 600;">${item.total}</td>
                    </tr>
                    `
                        )
                        .join('')}
                </tbody>
            </table>

            <div class="summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                </div>
                ${deliveryFee ? `<div class="summary-row"><span>Delivery Fee</span><span>${deliveryFee}</span></div>` : ''}
                ${tax ? `<div class="summary-row"><span>Tax</span><span>${tax}</span></div>` : ''}
                ${discount ? `<div class="summary-row"><span>Discount</span><span>-${discount}</span></div>` : ''}
                <div class="total-row">
                    <span>Total</span>
                    <span>${total}</span>
                </div>
                ${paidAmount ? `<div class="paid-row"><span>Paid</span><span>${paidAmount}</span></div>` : ''}
                ${balanceDue ? `<div class="balance-row ${balanceDue !== '$0.00' && balanceDue !== '0' ? 'due' : 'zero'}"><span>Balance Due</span><span>${balanceDue}</span></div>` : ''}
            </div>

            ${
                notes
                    ? `
            <div class="notes">
                <p>${notes}</p>
            </div>
            `
                    : ''
            }

            <div class="footer">
                <p>Thank you for your business! · ${companyName}</p>
            </div>
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
