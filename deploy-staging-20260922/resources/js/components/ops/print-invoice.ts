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
        printFrame.style.position = 'absolute';
        printFrame.style.left = '-9999px';
        printFrame.style.top = '-9999px';
        printFrame.style.width = '300px';
        printFrame.style.height = '400px';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);
    }

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
            padding: 24px 0;
        }
        .invoice-card {
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            padding: 0 16px;
        }
        .header { text-align: center; margin-bottom: 16px; }
        .header h1 { font-size: 18px; font-weight: 700; margin: 0; color: #111827; }
        .header p { margin: 2px 0; font-size: 12px; color: #6b7280; }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            background: #f3f4f6;
            color: #374151;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            margin-top: 8px;
            letter-spacing: 0.05em;
        }
        .details { margin: 12px 0; font-size: 13px; }
        .details-row { display: flex; justify-content: space-between; padding: 2.5px 0; }
        .details-row span:first-child { color: #6b7280; }
        .details-row span:last-child { font-weight: 600; color: #111827; }
        table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        th {
            text-align: left;
            font-size: 11px;
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            padding: 6px 4px;
            border-bottom: 2px solid #e5e5e5;
        }
        th.right { text-align: right; }
        td { padding: 6px 4px; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
        td.right { text-align: right; }
        .sub-text { font-size: 10px; color: #9ca3af; display: block; }
        .summary { border-top: 1px solid #e5e5e5; padding-top: 8px; margin-top: 8px; font-size: 13px; }
        .summary-row { display: flex; justify-content: space-between; padding: 2px 0; }
        .summary-row span:first-child { color: #6b7280; }
        .total-row {
            font-size: 16px;
            font-weight: 700;
            padding: 6px 0 2px;
            border-top: 1px solid #e5e5e5;
            margin-top: 4px;
            display: flex;
            justify-content: space-between;
            color: #111827;
        }
        .paid-row { display: flex; justify-content: space-between; padding: 2px 0; color: #16a34a; font-weight: 600; }
        .balance-row { display: flex; justify-content: space-between; padding: 2px 0; font-weight: 600; }
        .balance-row.due { color: #dc2626; }
        .balance-row.zero { color: #16a34a; }
        .notes { margin-top: 12px; border-top: 1px solid #e5e5e5; padding-top: 8px; }
        .notes p { font-size: 12px; color: #6b7280; margin: 0; }
        .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e5e5; }
        hr { border: none; border-top: 1px solid #e5e5e5; margin: 12px 0; }
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
            .invoice-card {
                width: 100% !important;
                max-width: 400px !important;
                margin: 0 auto !important;
                padding: 0 !important;
            }
            @page {
                margin: 8mm auto;
                size: auto;
            }
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="page-container">
        <div class="invoice-card">
            <div class="header">
                <h1>${companyName}</h1>
                <p>${companyAddress} · ${companyPhone}</p>
                ${companyEmail ? `<p>${companyEmail}</p>` : ''}
                <p>${formatDate(createdAt)}</p>
                <div class="badge">INVOICE</div>
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
                <div class="details-row">
                    <span>Phone</span>
                    <span>${paymentPhone ?? customer.phone ?? '—'}</span>
                </div>
                `
                        : ''
                }
                ${
                    paymentMethod
                        ? `
                <div class="details-row">
                    <span>Payment</span>
                    <span style="text-transform: capitalize;">${paymentMethod.replace('_', ' ')}</span>
                </div>
                `
                        : ''
                }
                <div class="details-row">
                    <span>Status</span>
                    <span style="text-transform: capitalize;">${paymentStatus}</span>
                </div>
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
                        <td>
                            <span style="font-weight: 500;">${item.name}</span>
                            ${item.unit ? `<span class="sub-text">per ${item.unit}</span>` : ''}
                        </td>
                        <td class="right">${item.quantity}</td>
                        <td class="right">${formatCurrency(item.unit_price)}</td>
                        <td class="right" style="font-weight: 600;">${formatCurrency(item.line_total)}</td>
                    </tr>
                    `
                        )
                        .join('')}
                </tbody>
            </table>

            <div class="summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                ${
                    discountAmount > 0
                        ? `
                <div class="summary-row">
                    <span>Discount (${discountType === 'percentage' ? discountAmount + '%' : formatCurrency(discountAmount)})</span>
                    <span>-${formatCurrency(discountAmount)}</span>
                </div>
                `
                        : ''
                }
                ${
                    taxAmount > 0
                        ? `
                <div class="summary-row">
                    <span>Tax</span>
                    <span>${formatCurrency(taxAmount)}</span>
                </div>
                `
                        : ''
                }
                ${
                    shippingAmount > 0
                        ? `
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>${formatCurrency(shippingAmount)}</span>
                </div>
                `
                        : ''
                }
                <hr />
                <div class="total-row">
                    <span>Total</span>
                    <span>${formatCurrency(grandTotal)}</span>
                </div>
                <div class="paid-row">
                    <span>Paid</span>
                    <span>${formatCurrency(paidAmount)}</span>
                </div>
                <div class="balance-row ${balanceDue > 0 ? 'due' : 'zero'}">
                    <span>Balance Due</span>
                    <span>${formatCurrency(balanceDue)}</span>
                </div>
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

export { printOrderReceipt } from './print-order-receipt';
export type { PrintOrderReceiptProps } from './print-order-receipt';
