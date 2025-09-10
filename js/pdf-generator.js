/**
 * PDF Generator
 * Handles generating PDF from the invoice using html2pdf
 */

class PDFGenerator {
    constructor() {
        this.printElementId = 'printableInvoice';
    }

    async generatePDF() {
        try {
            // Copy current form data to printable section
            this.copyFormDataToPrintableSection();
            
            const element = document.getElementById(this.printElementId);
            if (!element) {
                console.error('Printable invoice element not found');
                return;
            }

            // Show the printable section temporarily
            element.style.display = 'block';

            const invoiceNumber = document.getElementById('invoiceNumber')?.value || 'invoice';
            
            const options = {
                margin: 1,
                filename: `invoice_${invoiceNumber}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            await html2pdf().set(options).from(element).save();
            
            // Hide the printable section again
            element.style.display = 'none';
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    }

    copyFormDataToPrintableSection() {
        // Copy header information
        document.getElementById('printInvoiceDate').textContent = 
            document.getElementById('invoiceDate').value || '';
        document.getElementById('printInvoiceNumber').textContent = 
            document.getElementById('invoiceNumber').value || '';
        document.getElementById('printSoldTo').textContent = 
            document.getElementById('soldTo').value || '';
        document.getElementById('printConsignedTo').textContent = 
            document.getElementById('consignedTo').value || '';

        // Copy invoice items
        const sourceItems = document.querySelectorAll('#invoiceItems .table-row');
        const printItemsContainer = document.getElementById('printInvoiceItems');
        printItemsContainer.innerHTML = '';

        sourceItems.forEach(row => {
            const qty = row.querySelector('.qty-input')?.value || '';
            const unit = row.querySelector('.unit-input')?.value || '';
            const description = row.querySelector('.description-input')?.value || '';
            const price = row.querySelector('.price-input')?.value || '';
            const total = row.querySelector('.total-cell')?.textContent || '';

            // Only add rows that have some content
            if (qty || unit || description || price) {
                const printRow = document.createElement('tr');
                printRow.innerHTML = `
                    <td>${qty}</td>
                    <td>${unit}</td>
                    <td>${description}</td>
                    <td>$${price ? parseFloat(price).toFixed(2) : '0.00'}</td>
                    <td>${total}</td>
                `;
                printItemsContainer.appendChild(printRow);
            }
        });

        // Copy grand total
        document.getElementById('printGrandTotal').textContent = 
            document.getElementById('grandTotal').textContent || '$0.00';
    }

    printInvoice() {
        // Copy form data to printable section
        this.copyFormDataToPrintableSection();
        
        const printContent = document.getElementById(this.printElementId);
        if (!printContent) {
            console.error('Printable invoice element not found');
            return;
        }

        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        
        // Reinitialize the app after printing
        if (window.invoiceApp) {
            window.invoiceApp.initialize();
        }
    }
}

// Make PDFGenerator globally available
window.PDFGenerator = PDFGenerator;
