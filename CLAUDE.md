# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page invoice generator web application built with vanilla HTML, CSS, and JavaScript. The application creates professional invoices with functionality for dynamic row management, CSV import/export, and PDF generation.

## Development Commands

```bash
# Run development server with live reload
npx live-server

# The server will automatically open the browser at http://127.0.0.1:8080
# Changes to index.html will automatically reload the page
```

## Architecture

The entire application is contained in a single `index.html` file that includes:

- **Self-contained structure**: All CSS styles and JavaScript logic are embedded within the HTML file
- **Invoice form management**: Dynamic row addition/removal for invoice items
- **Calculation engine**: Automatic calculation of row totals and grand totals with tax
- **Data persistence**: CSV import/export functionality for saving and loading invoice data
- **PDF generation**: Uses browser's native print functionality to generate PDF invoices
- **Print optimization**: Specific CSS rules for clean print output

## Key JavaScript Functions

- `calculateRowTotal()`: Calculates individual line item totals
- `calculateGrandTotal()`: Computes subtotal, tax, and grand total
- `addRow()/removeRow()`: Manages dynamic invoice rows
- `saveAsCSV()/importCSV()`: Handles CSV data import/export
- `generateInvoiceNumber()`: Creates automatic invoice numbering
- `handleInputChange()`: Manages input events and triggers calculations

## Dependencies

- **live-server** (v1.2.2): Development server with auto-reload (dev dependency only)

## Important Implementation Notes

- The application uses inline event handlers and vanilla JavaScript - no framework dependencies
- All styling is contained within `<style>` tags in the document head
- The invoice table dynamically adds new rows when the last row is filled
- CSV export/import maintains all invoice data including company information and line items
- Print styles are optimized to hide action buttons and maintain proper formatting