# 📄 Faktu

### Professional Invoice Generator & Management System

<div align="center">
  <img src="assets/images/faktu-logo.png" alt="Faktu Logo" width="120">
  
  **Create, customize, and manage professional invoices with ease**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
</div>

---

## ✨ Features

### 🏢 **Company Management**
- **Multi-Company Profiles**: Save and switch between different company configurations
- **Custom Branding**: Upload company logos and set brand colors
- **Complete Company Information**: Name, address, contact details, and website

### 📋 **Invoice Creation**
- **Dynamic Invoice Building**: Add/remove items with real-time calculations
- **Automatic Numbering**: Configurable invoice prefixes and starting numbers
- **Tax Calculations**: Built-in tax rate configuration and automatic calculations
- **Professional Layout**: Clean, print-ready invoice design

### 💾 **Data Management**
- **Auto-Save**: Automatic draft saving as you work
- **Draft System**: Save incomplete invoices and return to them later
- **Local Storage**: All data stored securely in your browser
- **Export Options**: Print to PDF using native browser functionality

### 🎨 **Customization**
- **Brand Colors**: Customize invoice colors to match your brand
- **Logo Integration**: Upload and position your company logo
- **Flexible Layout**: Responsive design that works on all devices

### 🚀 **User Experience**
- **Floating Action Menu**: Quick access to all major functions
- **Keyboard Shortcuts**: Efficient workflow with hotkeys
- **Instant Preview**: See changes in real-time
- **Clean Interface**: Intuitive, distraction-free design

---

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic web server capability (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fredodupoux/invoice.git
   cd invoice
   ```

2. **Install dependencies** (optional, for development)
   ```bash
   npm install
   ```

3. **Start the application**
   
   **Option A: Using Python (recommended)**
   ```bash
   python3 -m http.server 8080
   ```
   
   **Option B: Using Node.js live-server**
   ```bash
   npx live-server --port=8080
   ```
   
   **Option C: Using any web server**
   Simply serve the files from any web server of your choice.

4. **Open in browser**
   Navigate to `http://localhost:8080`

---

## 📱 How to Use

### 🏁 Getting Started

1. **First Launch**: Open the application and click the floating menu button (☰)
2. **Company Setup**: Click "Company Settings" to configure your business information
3. **Create Invoice**: Click the "+" button to start a new invoice

### 🏢 Setting Up Your Company

1. **Access Settings**: Click the menu button → "Company Settings"
2. **Company Information**:
   - Enter your company name, address, phone, email, and website
   - Configure invoice prefix (e.g., "INV", "BILL") and starting number
   - Set your tax rate percentage

3. **Branding**:
   - Upload your company logo (PNG, JPG, GIF supported)
   - Choose your brand color using the color picker
   - Preview changes in real-time

4. **Save Profile**: Click "💾 Save & Create Profile" to save settings and optionally create a reusable profile

### 📄 Creating an Invoice

1. **Start New Invoice**: Click the "+" floating action button
2. **Customer Information**: Fill in customer details (name, address, email)
3. **Add Items**:
   - Click "Add Item" to add invoice line items
   - Enter description, quantity, and unit price
   - View automatic calculations in real-time
4. **Review**: Check all details and calculations
5. **Generate**: Use Ctrl+P (or Cmd+P on Mac) to print or save as PDF

### 💾 Managing Drafts

- **Auto-Save**: Drafts are automatically saved as you work
- **Save Draft**: Click the "Save Draft" floating button to manually save
- **View Drafts**: Click "View Drafts" to see all saved drafts
- **Resume Work**: Click on any draft to continue editing

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + P` | Print invoice or save as PDF |
| `Ctrl/Cmd + S` | Save current draft |
| `Escape` | Close open modals |
| `Enter` | Add new item (when in item fields) |

---

## 🏗️ Architecture

### 📁 Project Structure

```
faktu/
├── index.html              # Main application entry point
├── assets/
│   ├── images/             # Logo and image assets
│   └── fonts/              # Custom fonts
├── css/
│   ├── main.css           # Main stylesheet
│   └── modal.css          # Modal and overlay styles
├── js/
│   ├── app.js             # Main application controller
│   ├── invoice-core.js    # Invoice logic and calculations
│   ├── company-settings.js # Company management
│   ├── storage.js         # Data persistence layer
│   ├── draft-ui.js        # Draft management interface
│   ├── autosave.js        # Automatic saving functionality
│   ├── csv-handler.js     # CSV import/export
│   └── serializer.js      # Data serialization utilities
└── package.json           # Dependencies and scripts
```

### 🧩 Key Components

- **App Controller** (`app.js`): Main application orchestrator
- **Invoice Core** (`invoice-core.js`): Business logic and calculations
- **Storage Manager** (`storage.js`): Data persistence and retrieval
- **Company Settings** (`company-settings.js`): Company profile management
- **Draft System** (`draft-ui.js`, `autosave.js`): Draft saving and management

---

## 🔧 Configuration

### 🎨 Customizing Appearance

Edit `css/main.css` to customize:
- Color schemes
- Typography
- Layout spacing
- Print styles

### 📊 Default Settings

Modify `js/storage.js` to change:
- Default company information
- Default tax rates
- Invoice numbering format
- Auto-save intervals

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the existing code style
4. **Test thoroughly**: Ensure all features work correctly
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes clearly

### 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and version information

---

## 📋 Requirements

### 🖥️ Browser Support
- Chrome 60+ ✅
- Firefox 55+ ✅
- Safari 12+ ✅
- Edge 79+ ✅

### 💾 Storage
- Uses browser's localStorage (no server required)
- Data persists between sessions
- Approximately 5-10MB storage capacity

---

## 🛣️ Roadmap

### 🎯 Upcoming Features
- [ ] Multi-currency support
- [ ] Advanced tax calculations (VAT, GST)
- [ ] Customer database management
- [ ] Recurring invoice templates
- [ ] Email integration
- [ ] Advanced reporting and analytics
- [ ] Mobile app version

### 🔮 Future Enhancements
- [ ] Cloud synchronization
- [ ] Multi-user collaboration
- [ ] Advanced theming system
- [ ] Plugin architecture
- [ ] API integrations

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for simple, professional invoicing
- Community feedback and contributions

---

<div align="center">
  <strong>Made with ❤️ for small businesses and freelancers</strong>
  
  **[Report Bug](https://github.com/fredodupoux/invoice/issues)** • 
  **[Request Feature](https://github.com/fredodupoux/invoice/issues)** • 
  **[Documentation](https://github.com/fredodupoux/invoice/wiki)**
</div>
