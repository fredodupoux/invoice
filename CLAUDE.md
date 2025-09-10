# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Faktu** is a professional invoice generator and management system built with modern vanilla JavaScript architecture. The application provides comprehensive invoice creation, company management, draft persistence, and brand customization capabilities for small businesses and freelancers.

## Development Commands

```bash
# Install dependencies (development only)
npm install

# Run development server with live reload
npx live-server --port=8080

# Alternative: Python development server
python3 -m http.server 8080

# The server will open at http://localhost:8080
# All changes are automatically reflected due to the live-reload setup
```

## Modern Architecture

The application follows a **modular architecture** with organized file structure:

### **File Structure:**
```
faktu/
├── index.html              # Main application entry point
├── assets/
│   ├── images/faktu-logo.png  # Application logo
│   └── fonts/              # Custom fonts
├── css/
│   ├── main.css           # Core application styles
│   └── modal.css          # Modal and overlay styles
├── js/
│   ├── app.js             # Main application coordinator
│   ├── invoice-core.js    # Core invoice logic and calculations
│   ├── company-settings.js # Company profile management
│   ├── storage.js         # Data persistence layer (localStorage)
│   ├── draft-ui.js        # Draft management interface
│   ├── autosave.js        # Automatic saving functionality
│   ├── csv-handler.js     # CSV import/export
│   └── serializer.js      # Data serialization utilities
└── package.json           # Dependencies and scripts
```

### **Key Features:**
- **Company Management**: Multi-profile system with logo upload and brand customization
- **Draft Persistence**: Complete localStorage-based draft management with auto-save
- **Modern UI**: Floating action menu system with professional modal interfaces
- **Brand Customization**: Real-time color picker and logo management
- **Print System**: Native browser print functionality (no external PDF dependencies)
- **Data Import/Export**: CSV functionality for data portability
- **Responsive Design**: Works across desktop, tablet, and mobile devices

## Core JavaScript Modules

### **app.js** - Main Application Controller
- Coordinates all modules and initializes the system
- Manages floating action menu and keyboard shortcuts
- Handles main application lifecycle and coordination

### **invoice-core.js** - Invoice Logic Engine
- `calculateRowTotal()` - Individual line item calculations
- `calculateGrandTotal()` - Subtotal, tax, and final total computation
- `addRow()/removeRow()` - Dynamic row management
- `collectInvoiceData()` - Form data collection and validation

### **company-settings.js** - Company Profile Manager
- Multi-company profile save/load/delete functionality
- Logo upload and preview system
- Brand color customization with live preview
- Company information management (name, address, contact details)

### **storage.js** - Data Persistence Layer
- localStorage management with error handling
- Company profile CRUD operations
- Settings persistence and retrieval
- Storage quota monitoring and cleanup

### **draft-ui.js** - Draft Management Interface
- Professional modal interface for draft management
- Draft list with metadata display (client, date, total)
- Load/delete operations with confirmation dialogs
- Auto-saved draft recovery prompts

### **autosave.js** - Automatic Saving System
- Smart 30-second interval auto-save
- Dirty state tracking with real-time change detection
- Visual save status indicators
- Configurable save intervals and recovery

### **csv-handler.js** - Import/Export Functionality
- CSV export with complete invoice data preservation
- CSV import with validation and error handling
- Automatic filename generation
- Data format compatibility maintenance

### **serializer.js** - Data Serialization
- Form data collection and restoration
- JSON serialization with type preservation
- Cross-session data compatibility
- Metadata handling for drafts and company profiles

## Advanced Features

### **Company Profile System:**
- Save multiple company configurations
- Switch between different business profiles
- Logo upload with preview and validation
- Brand color customization with live preview
- Complete company information management

### **Draft Management:**
- Auto-save every 30 seconds with visual indicators
- Manual save with custom naming
- Draft recovery on page reload
- Professional draft list interface
- Metadata tracking (creation date, client, total)

### **Modern UI Components:**
- Floating action menu with 4 main functions
- Professional modal interfaces with smooth animations
- Real-time color picker with hex validation
- Responsive design optimized for all devices
- Keyboard shortcuts (Ctrl+S, Ctrl+P, Escape)

### **Print & Export:**
- Native browser print functionality (Ctrl+P)
- Optimized print CSS for professional output
- CSV export/import for data portability
- Automatic invoice numbering

## Dependencies

- **live-server** (v1.2.2): Development server with auto-reload (dev dependency only)
- **No runtime dependencies**: Pure vanilla JavaScript implementation

## Important Implementation Notes

### **Architecture Principles:**
- **Modular Design**: Each module has a single responsibility
- **Zero External Dependencies**: No frameworks or libraries required at runtime
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Data Persistence**: All data stored in browser localStorage
- **Mobile-First**: Responsive design optimized for all screen sizes

### **Code Organization:**
- **Separation of Concerns**: Logic, styles, and markup are properly separated
- **Event-Driven**: Uses modern event listeners instead of inline handlers
- **Error Handling**: Comprehensive error handling across all modules
- **Performance Optimized**: Efficient DOM manipulation and data handling

### **Data Management:**
- **localStorage Persistence**: ~5-10MB capacity for hundreds of invoices
- **JSON Serialization**: Robust data format with type preservation
- **Auto-Recovery**: Automatic draft recovery on browser restart
- **Multi-Company**: Support for multiple business configurations

### **Print Optimization:**
- **CSS Print Media Queries**: Optimized print styles hide UI elements
- **Professional Layout**: Clean, business-appropriate print output
- **Logo Integration**: Company logos properly sized and positioned
- **Brand Colors**: Custom brand colors applied throughout interface

The application represents a modern, professional solution for invoice generation with enterprise-level features implemented using pure web technologies.