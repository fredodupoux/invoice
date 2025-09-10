/**
 * Invoice Core Functions
 * Contains the main invoice calculation and manipulation functions
 */

class InvoiceCore {
    constructor() {
        this.invoiceTableBody = null;
        this.grandTotalElement = null;
    }

    initialize() {
        this.invoiceTableBody = document.getElementById('invoiceItems');
        this.grandTotalElement = document.getElementById('grandTotal');
        
        // Set today's date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('invoiceDate').value = today;
        
        // Set up invoice number generation
        this.setupInvoiceNumberGeneration();
        
        // Add initial row
        this.addRow();
    }

    // Original invoice calculation functions
    calculateRowTotal(input) {
        const row = input.closest('tr');
        const qty = parseFloat(row.querySelector('.qty-input').value) || 0;
        const price = parseFloat(row.querySelector('.price-input').value) || 0;
        const total = qty * price;
        
        row.querySelector('.total-cell').textContent = '$' + total.toFixed(2);
        
        this.calculateGrandTotal();
    }
    
    checkAndAddNewRow(currentRow) {
        const allRows = document.querySelectorAll('#invoiceItems .table-row');
        const isLastRow = currentRow === allRows[allRows.length - 1];
        
        if (isLastRow) {
            const inputs = currentRow.querySelectorAll('input');
            let hasContent = false;
            inputs.forEach(input => {
                if (input.value.trim() !== '') hasContent = true;
            });
            
            if (hasContent) {
                this.addRow();
            }
        }
    }
    
    handleInputChange(input) {
        const row = input.closest('tr');
        if (row) {
            this.checkAndAddNewRow(row);
        }
    }
    
    calculateGrandTotal() {
        const totalCells = document.querySelectorAll('.total-cell');
        let grandTotal = 0;
        
        totalCells.forEach(cell => {
            const value = parseFloat(cell.textContent.replace('$', '')) || 0;
            grandTotal += value;
        });
        
        this.grandTotalElement.textContent = '$' + grandTotal.toFixed(2);
    }
    
    generateInvoiceNumber() {
        if (window.companySettings) {
            return window.companySettings.generateInvoiceNumber();
        }
        
        // Fallback to original method
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        
        return `${year}${month}${day}${hour}${minute}`;
    }
    
    updatePageTitle() {
        const invoiceNumber = document.getElementById('invoiceNumber').value;
        if (invoiceNumber) {
            document.getElementById('pageTitle').textContent = `Invoice ${invoiceNumber} - US AGRICOM`;
        } else {
            document.getElementById('pageTitle').textContent = 'US AGRICOM Invoice Template';
        }
    }

    setupInvoiceNumberGeneration() {
        const invoiceNumberField = document.getElementById('invoiceNumber');
        
        invoiceNumberField.addEventListener('focus', () => {
            if (!invoiceNumberField.value) {
                invoiceNumberField.value = this.generateInvoiceNumber();
                this.updatePageTitle();
            }
        });
        
        invoiceNumberField.addEventListener('change', () => {
            this.updatePageTitle();
        });
    }
    
    addRow() {
        const newRow = document.createElement('tr');
        newRow.className = 'table-row invoice-row';
        newRow.innerHTML = `
            <td>
                <input type="number" class="input-field qty-input" min="0" step="1" onchange="window.invoiceCore.calculateRowTotal(this)" oninput="window.invoiceCore.handleInputChange(this)">
                <div class="row-controls">
                    <button class="row-control-btn remove-btn" onclick="window.invoiceCore.removeRowAtIndex(this)" title="Remove row">−</button>
                    <button class="row-control-btn add-btn" onclick="window.invoiceCore.addRow()" title="Add row">+</button>
                </div>
            </td>
            <td><input type="text" class="input-field unit-input" oninput="window.invoiceCore.handleInputChange(this)"></td>
            <td><input type="text" class="input-field description-input" oninput="window.invoiceCore.handleInputChange(this)"></td>
            <td><input type="number" class="input-field price-input" min="0" step="1" onchange="window.invoiceCore.calculateRowTotal(this)" oninput="window.invoiceCore.handleInputChange(this)"></td>
            <td class="total-cell">$0.00</td>
        `;
        this.invoiceTableBody.appendChild(newRow);
    }
    
    removeRow() {
        const rows = this.invoiceTableBody.querySelectorAll('.table-row');
        if (rows.length > 1) {
            this.invoiceTableBody.removeChild(rows[rows.length - 1]);
            this.calculateGrandTotal();
        }
    }

    // Remove specific row when clicking the - button
    removeRowAtIndex(button) {
        const row = button.closest('tr');
        const rows = this.invoiceTableBody.querySelectorAll('.table-row');
        
        // Don't allow removing the last remaining row
        if (rows.length > 1) {
            row.remove();
            this.calculateGrandTotal();
        }
    }

    collectInvoiceData() {
        const rows = document.querySelectorAll('#invoiceItems .table-row');
        const items = [];

        rows.forEach(row => {
            const qty = row.querySelector('.qty-input').value || '';
            const unit = row.querySelector('.unit-input').value || '';
            const description = row.querySelector('.description-input').value || '';
            const price = row.querySelector('.price-input').value || '';
            const total = row.querySelector('.total-cell').textContent || '';

            if (qty || unit || description || price) {
                items.push({ quantity: qty, unit, description, price, total });
            }
        });

        return {
            invoiceDate: document.getElementById('invoiceDate')?.value || '',
            invoiceNumber: document.getElementById('invoiceNumber')?.value || '',
            soldTo: document.getElementById('soldTo')?.value || '',
            consignedTo: document.getElementById('consignedTo')?.value || '',
            items
        };
    }
}

// Make InvoiceCore globally available
window.InvoiceCore = InvoiceCore;
