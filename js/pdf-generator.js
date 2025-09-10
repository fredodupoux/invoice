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
            // Use the main invoice container for PDF generation to match browser print
            const element = document.querySelector('.container');
            if (!element) {
                console.error('Invoice container not found');
                return;
            }

            // Get invoice number for filename
            const invoiceNumber = document.getElementById('invoiceNumber')?.value || 'invoice';
            
            // Temporarily hide UI elements for PDF generation
            this.hideUIElements();
            
            const options = {
                margin: [0.5, 0.5, 0.5, 0.5], // Reduced margins
                filename: `invoice_${invoiceNumber}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: false
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'letter', 
                    orientation: 'portrait',
                    putOnlyUsedFonts: true
                }
            };

            await html2pdf().set(options).from(element).save();
            
            // Restore UI elements
            this.showUIElements();
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
            // Make sure to restore UI elements even on error
            this.showUIElements();
        }
    }

    hideUIElements() {
        // Store original display values and hide UI elements
        this.hiddenElements = [];
        
        const elementsToHide = [
            '.menu-toggle',
            '.new-invoice-toggle', 
            '.side-menu',
            '.menu-overlay',
            '#autoSaveStatus',
            '.row-controls'
        ];
        
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.style.display !== 'none') {
                    this.hiddenElements.push({
                        element: el,
                        originalDisplay: el.style.display || ''
                    });
                    el.style.display = 'none';
                }
            });
        });
        
        // Style form elements to look like plain text
        const formElements = document.querySelectorAll('input, textarea, button, select');
        formElements.forEach(el => {
            if (el.type !== 'button' && !el.classList.contains('menu-button')) {
                this.hiddenElements.push({
                    element: el,
                    originalBorder: el.style.border || '',
                    originalBackground: el.style.background || '',
                    originalBoxShadow: el.style.boxShadow || '',
                    originalOutline: el.style.outline || ''
                });
                el.style.border = 'none';
                el.style.background = 'transparent';
                el.style.boxShadow = 'none';
                el.style.outline = 'none';
            }
        });
    }

    showUIElements() {
        // Restore original values
        if (this.hiddenElements) {
            this.hiddenElements.forEach(item => {
                if (item.originalDisplay !== undefined) {
                    item.element.style.display = item.originalDisplay;
                }
                if (item.originalBorder !== undefined) {
                    item.element.style.border = item.originalBorder;
                    item.element.style.background = item.originalBackground;
                    item.element.style.boxShadow = item.originalBoxShadow;
                    item.element.style.outline = item.originalOutline;
                }
            });
            this.hiddenElements = [];
        }
    }

    printInvoice() {
        // Use browser's native print function for consistent layout
        window.print();
    }
}

// Make PDFGenerator globally available
window.PDFGenerator = PDFGenerator;
