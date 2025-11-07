import React from 'react';
import { toast } from 'react-hot-toast';

const PrintBill = ({ 
    orderData, 
    buttonText = "Print Bill", 
    buttonClassName = "",
    showIcon = true,
    disabled = false,
    onBeforePrint = null, // New prop for executing before print
    onAfterPrint = null  // New prop for executing after print
}) => {
    const handlePrintBill = async () => {
        let dataForPrinting = orderData;
        
        // If onBeforePrint is provided, execute it first (e.g., save order)
        if (onBeforePrint) {
            const result = await onBeforePrint();
            if (!result) {
                // If save failed, don't proceed with printing
                return;
            }
            // Use the returned data if available (includes saved order ID)
            dataForPrinting = result;
        }
        
        if (!dataForPrinting || !dataForPrinting.items || dataForPrinting.items.length === 0) {
            toast.error("No items to print");
            return;
        }

        const currentDate = dataForPrinting.createdAt 
            ? new Date(dataForPrinting.createdAt).toLocaleString()
            : new Date().toLocaleString();

        const orderId = dataForPrinting._id 
            ? dataForPrinting._id.slice(-6).toUpperCase() 
            : 'NEW';

        // Calculate totals
        const subtotal = dataForPrinting.subtotal || dataForPrinting.items.reduce((total, item) => 
            total + (item.price * item.qty), 0
        );
        const tax = dataForPrinting.tax || (subtotal * 0.13);
        const serviceCharge = dataForPrinting.serviceCharge || 
            (dataForPrinting.orderType === "dine-in" ? subtotal * 0.1 : 0);
        const total = dataForPrinting.total || (subtotal + tax + serviceCharge);

        // Create print window content (same as before)
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Bill - Order #${orderId}</title>
                <style>
                    body {
                        font-family: 'Courier New', monospace;
                        max-width: 400px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px dashed #000;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .header p {
                        margin: 5px 0;
                        font-size: 12px;
                    }
                    .info-section {
                        margin-bottom: 20px;
                        font-size: 14px;
                    }
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 5px 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th {
                        text-align: left;
                        border-bottom: 1px solid #000;
                        padding: 5px 0;
                        font-size: 14px;
                    }
                    td {
                        padding: 5px 0;
                        font-size: 14px;
                    }
                    .text-right {
                        text-align: right;
                    }
                    .text-center {
                        text-align: center;
                    }
                    .totals {
                        border-top: 1px solid #000;
                        margin-top: 10px;
                        padding-top: 10px;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 5px 0;
                        font-size: 14px;
                    }
                    .grand-total {
                        font-weight: bold;
                        font-size: 16px;
                        border-top: 2px solid #000;
                        border-bottom: 2px solid #000;
                        padding: 10px 0;
                        margin: 10px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        font-size: 12px;
                    }
                    .status-section {
                        margin: 15px 0;
                        padding: 10px;
                        border: 1px solid #000;
                        font-size: 14px;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 10px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>RESTAURANT NAME</h1>
                    <p>123 Main Street, City</p>
                    <p>Tel: 011-2345678</p>
                    <p>Email: info@restaurant.com</p>
                </div>
                
                <div class="info-section">
                    ${orderId !== 'NEW' ? `
                        <div class="info-row">
                            <span><strong>Order #:</strong></span>
                            <span>${orderId}</span>
                        </div>
                    ` : ''}
                    <div class="info-row">
                        <span><strong>Date:</strong></span>
                        <span>${currentDate}</span>
                    </div>
                    <div class="info-row">
                        <span><strong>Order Type:</strong></span>
                        <span>${dataForPrinting.orderType ? dataForPrinting.orderType.toUpperCase() : 'N/A'}</span>
                    </div>
                    ${dataForPrinting.customerName ? `
                        <div class="info-row">
                            <span><strong>Customer:</strong></span>
                            <span>${dataForPrinting.customerName}</span>
                        </div>
                    ` : ''}
                    ${dataForPrinting.customerPhone ? `
                        <div class="info-row">
                            <span><strong>Phone:</strong></span>
                            <span>${dataForPrinting.customerPhone}</span>
                        </div>
                    ` : ''}
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th style="width: 50%">Item</th>
                            <th class="text-center" style="width: 15%">Qty</th>
                            <th class="text-right" style="width: 17.5%">Price</th>
                            <th class="text-right" style="width: 17.5%">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataForPrinting.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td class="text-center">${item.qty}</td>
                                <td class="text-right">${item.price.toFixed(2)}</td>
                                <td class="text-right">${(item.price * item.qty).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>LKR ${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax (13%):</span>
                        <span>LKR ${tax.toFixed(2)}</span>
                    </div>
                    ${dataForPrinting.orderType === "dine-in" ? `
                        <div class="total-row">
                            <span>Service Charge (10%):</span>
                            <span>LKR ${serviceCharge.toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="total-row grand-total">
                        <span>GRAND TOTAL:</span>
                        <span>LKR ${total.toFixed(2)}</span>
                    </div>
                </div>
                
                ${dataForPrinting.status || dataForPrinting.paymentStatus ? `
                    <div class="status-section">
                        ${dataForPrinting.status ? `
                            <div class="info-row">
                                <span><strong>Order Status:</strong></span>
                                <span>${dataForPrinting.status.toUpperCase()}</span>
                            </div>
                        ` : ''}
                        ${dataForPrinting.paymentStatus ? `
                            <div class="info-row">
                                <span><strong>Payment Status:</strong></span>
                                <span>${dataForPrinting.paymentStatus.toUpperCase()}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="footer">
                    <p>================================</p>
                    <p><strong>Thank you for your visit!</strong></p>
                    <p>Please come again</p>
                    <p>================================</p>
                </div>
            </body>
            </html>
        `;

        // Open print window
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            toast.error("Please allow pop-ups to print the bill");
            return;
        }
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for content to load then print
        printWindow.onload = function() {
            printWindow.print();
            
            // Execute onAfterPrint callback after printing
            if (onAfterPrint) {
                setTimeout(() => {
                    onAfterPrint();
                }, 100);
            }
        };
    };

    const defaultButtonClass = "px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2 text-sm";

    return (
        <button
            type="button"
            onClick={handlePrintBill}
            disabled={disabled}
            className={buttonClassName || defaultButtonClass}
        >
            {showIcon && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                </svg>
            )}
            {buttonText}
        </button>
    );
};

export default PrintBill;