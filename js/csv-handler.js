/**
 * CSV Import/Export Functions
 * Handles saving invoice data to CSV and importing from CSV files
 */

class CSVHandler {
    constructor() {
        this.invoiceCore = null;
    }

    initialize(invoiceCore) {
        this.invoiceCore = invoiceCore;
    }

    exportToCSV() {
        if (!this.invoiceCore) {
            console.error('Invoice core not initialized');
            return;
        }

        const data = this.invoiceCore.collectInvoiceData();
        const csvContent = this.serializeToCSV(data);
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const invoiceNumber = data.invoiceNumber || 'invoice';
        link.setAttribute('href', url);
        link.setAttribute('download', `${invoiceNumber}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    serializeToCSV(data) {
        let csv = 'Field,Value\n';
        csv += `Invoice Date,"${data.invoiceDate}"\n`;
        csv += `Invoice Number,"${data.invoiceNumber}"\n`;
        csv += `Sold To,"${data.soldTo}"\n`;
        csv += `Consigned To,"${data.consignedTo}"\n`;
        csv += '\n';
        csv += 'Quantity,Unit,Description,Price,Total\n';
        
        data.items.forEach(item => {
            csv += `"${item.quantity}","${item.unit}","${item.description}","${item.price}","${item.total}"\n`;
        });
        
        return csv;
    }

    importFromCSV(file) {
        if (!this.invoiceCore) {
            console.error('Invoice core not initialized');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            this.parseCSVAndPopulate(csv);
        };
        reader.readAsText(file);
    }

    parseCSVAndPopulate(csv) {
        const lines = csv.split('\n');
        let currentSection = 'header';
        const data = { items: [] };
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line) {
                if (currentSection === 'header') {
                    currentSection = 'items';
                    i++; // Skip the items header line
                }
                continue;
            }
            
            if (currentSection === 'header') {
                const [field, value] = this.parseCSVLine(line);
                switch (field) {
                    case 'Invoice Date':
                        data.invoiceDate = value;
                        break;
                    case 'Invoice Number':
                        data.invoiceNumber = value;
                        break;
                    case 'Sold To':
                        data.soldTo = value;
                        break;
                    case 'Consigned To':
                        data.consignedTo = value;
                        break;
                }
            } else if (currentSection === 'items' && line !== 'Quantity,Unit,Description,Price,Total') {
                const [quantity, unit, description, price, total] = this.parseCSVLine(line);
                if (quantity || unit || description || price) {
                    data.items.push({ quantity, unit, description, price, total });
                }
            }
        }
        
        this.populateForm(data);
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    populateForm(data) {
        // Clear existing rows
        const tbody = document.getElementById('invoiceItems');
        tbody.innerHTML = '';
        
        // Populate header fields
        if (data.invoiceDate) document.getElementById('invoiceDate').value = data.invoiceDate;
        if (data.invoiceNumber) document.getElementById('invoiceNumber').value = data.invoiceNumber;
        if (data.soldTo) document.getElementById('soldTo').value = data.soldTo;
        if (data.consignedTo) document.getElementById('consignedTo').value = data.consignedTo;
        
        // Add rows for items
        data.items.forEach(item => {
            this.invoiceCore.addRow();
            const lastRow = tbody.lastElementChild;
            
            if (item.quantity) lastRow.querySelector('.qty-input').value = item.quantity;
            if (item.unit) lastRow.querySelector('.unit-input').value = item.unit;
            if (item.description) lastRow.querySelector('.description-input').value = item.description;
            if (item.price) lastRow.querySelector('.price-input').value = item.price;
            
            // Recalculate totals
            this.invoiceCore.calculateRowTotal(lastRow.querySelector('.qty-input'));
        });
        
        // Add one empty row at the end
        this.invoiceCore.addRow();
        
        // Update page title
        this.invoiceCore.updatePageTitle();
    }

    triggerFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importFromCSV(file);
            }
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }
}

// Make CSVHandler globally available
window.CSVHandler = CSVHandler;
