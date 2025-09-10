/**
 * Invoice Data Serialization Module
 * Handles collecting and restoring invoice form data
 */

class InvoiceSerializer {
    // Collect all form data into a structured object
    static collectInvoiceData() {
        const data = {
            // Header information
            invoiceDate: document.getElementById('invoiceDate')?.value || '',
            invoiceNumber: document.getElementById('invoiceNumber')?.value || '',
            soldTo: document.getElementById('soldTo')?.value || '',
            consignedTo: document.getElementById('consignedTo')?.value || '',
            
            // Invoice items
            items: [],
            
            // Totals (only grandTotal exists in current HTML)
            grandTotal: document.getElementById('grandTotal')?.textContent || '$0.00',
            
            // Metadata
            companyName: document.querySelector('.company-name')?.textContent || 'Your Company Name',
            pageTitle: document.getElementById('pageTitle')?.textContent || 'Faktu Invoice Template'
        };
        
        // Collect all invoice items
        const rows = document.querySelectorAll('#invoiceItems .table-row');
        rows.forEach(row => {
            const qty = row.querySelector('.qty-input')?.value || '';
            const unit = row.querySelector('.unit-input')?.value || '';
            const description = row.querySelector('.description-input')?.value || '';
            const price = row.querySelector('.price-input')?.value || '';
            const total = row.querySelector('.total-cell')?.textContent || '';
            
            // Only save rows with data
            if (qty || unit || description || price) {
                data.items.push({
                    quantity: qty,
                    unit: unit,
                    description: description,
                    price: price,
                    total: total
                });
            }
        });
        
        return data;
    }

    // Restore form data from a saved object
    static restoreInvoiceData(data) {
        if (!data) return;
        
        // Restore header information
        if (data.invoiceDate) {
            const dateInput = document.getElementById('invoiceDate');
            if (dateInput) dateInput.value = data.invoiceDate;
        }
        if (data.invoiceNumber) {
            const numberInput = document.getElementById('invoiceNumber');
            if (numberInput) numberInput.value = data.invoiceNumber;
        }
        if (data.soldTo) {
            const soldToInput = document.getElementById('soldTo');
            if (soldToInput) soldToInput.value = data.soldTo;
        }
        if (data.consignedTo) {
            const consignedToInput = document.getElementById('consignedTo');
            if (consignedToInput) consignedToInput.value = data.consignedTo;
        }
        
        // Clear existing rows
        const tbody = document.getElementById('invoiceItems');
        if (tbody) {
            tbody.innerHTML = '';
        }
        
        // Restore invoice items
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const newRow = document.createElement('tr');
                newRow.className = 'table-row invoice-row';
                newRow.innerHTML = `
                    <td>
                        <input type="number" class="input-field qty-input" min="0" step="1" onchange="calculateRowTotal(this)" oninput="handleInputChange(this)" value="${item.quantity || ''}">
                        <div class="row-controls">
                            <button class="row-control-btn remove-btn" onclick="window.invoiceCore.removeRowAtIndex(this)" title="Remove row">−</button>
                            <button class="row-control-btn add-btn" onclick="window.invoiceCore.addRow()" title="Add row">+</button>
                        </div>
                    </td>
                    <td><input type="text" class="input-field unit-input" oninput="handleInputChange(this)" value="${item.unit || ''}"></td>
                    <td><input type="text" class="input-field description-input" oninput="handleInputChange(this)" value="${item.description || ''}"></td>
                    <td><input type="number" class="input-field price-input" min="0" step="1" onchange="calculateRowTotal(this)" oninput="handleInputChange(this)" value="${item.price || ''}"></td>
                    <td class="total-cell">${item.total || ''}</td>
                `;
                if (tbody) tbody.appendChild(newRow);
            });
        } else {
            // Add at least one empty row
            if (typeof addRow === 'function') {
                addRow();
            }
        }
        
        // Recalculate totals
        if (typeof calculateGrandTotal === 'function') {
            calculateGrandTotal();
        }
    }

    // Validate invoice data
    static validateInvoiceData(data) {
        const errors = [];
        
        if (!data.invoiceNumber) {
            errors.push('Invoice number is required');
        }
        
        if (!data.items || data.items.length === 0) {
            errors.push('At least one invoice item is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvoiceSerializer;
}