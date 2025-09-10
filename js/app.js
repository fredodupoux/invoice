/**
 * Main Application Module
 * Coordinates all modules and initializes the invoice system
 */

class InvoiceApp {
    constructor() {
        this.storageManager = null;
        this.serializer = null;
        this.autoSave = null;
        this.draftUI = null;
        this.companySettings = null;
        this.invoiceCore = null;
        this.csvHandler = null;
        this.pdfGenerator = null;
        this.testStorage = null;
        
        this.initialized = false;
    }

    // Initialize the application
    initialize() {
        if (this.initialized) return;
        
        try {
            // Initialize core modules
            this.storageManager = new InvoiceStorageManager();
            this.serializer = InvoiceSerializer;
            this.companySettings = new CompanySettings(this.storageManager);
            this.autoSave = new AutoSave(this.storageManager, this.serializer);
            this.draftUI = new DraftUI(this.storageManager, this.serializer, this.autoSave);

            // Initialize new core modules
            this.invoiceCore = new InvoiceCore();
            this.csvHandler = new CSVHandler();
            this.pdfGenerator = new PDFGenerator();

            // Initialize invoice core first
            this.invoiceCore.initialize();
            
            // Initialize CSV handler with invoice core reference
            this.csvHandler.initialize(this.invoiceCore);

            // Make modules globally accessible for backward compatibility
            window.storageManager = this.storageManager;
            window.invoiceSerializer = this.serializer;
            window.autoSave = this.autoSave;
            window.companySettings = this.companySettings;
            window.invoiceCore = this.invoiceCore;
            window.csvHandler = this.csvHandler;
            window.pdfGenerator = this.pdfGenerator;

            // Set up global function references for backward compatibility
            window.addRow = () => this.invoiceCore.addRow();
            window.removeRow = () => this.invoiceCore.removeRow();
            window.exportToCSV = () => this.csvHandler.exportToCSV();
            window.openCSV = () => this.csvHandler.triggerFileInput();
            window.generatePDF = () => this.pdfGenerator.generatePDF();

            // Apply company settings to current invoice
            this.companySettings.applySettingsToInvoice();

            // Add UI buttons
            this.addInvoiceButtons();
            this.addDraftButtons();
            this.addCompanySettingsButton();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize test functions for console
            this.initializeTestFunctions();
            
            this.initialized = true;
            console.log('Invoice application initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize invoice application:', error);
        }
    }

    // Add main invoice action buttons
    addInvoiceButtons() {
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        const addRowBtn = document.createElement('button');
        addRowBtn.textContent = 'Add Row';
        addRowBtn.className = 'print-btn';
        addRowBtn.onclick = () => this.invoiceCore.addRow();
        
        const removeRowBtn = document.createElement('button');
        removeRowBtn.textContent = 'Remove Row';
        removeRowBtn.className = 'print-btn';
        removeRowBtn.onclick = () => this.invoiceCore.removeRow();
        
        const importCSVBtn = document.createElement('button');
        importCSVBtn.textContent = 'Open';
        importCSVBtn.className = 'print-btn';
        importCSVBtn.onclick = () => this.csvHandler.triggerFileInput();
        
        const saveCSVBtn = document.createElement('button');
        saveCSVBtn.textContent = 'Save As';
        saveCSVBtn.className = 'print-btn';
        saveCSVBtn.onclick = () => this.csvHandler.exportToCSV();
        
        const printBtn = document.createElement('button');
        printBtn.textContent = 'Print Invoice';
        printBtn.className = 'print-btn';
        printBtn.onclick = () => this.pdfGenerator.generatePDF();
        
        // Add buttons to container
        buttonContainer.appendChild(addRowBtn);
        buttonContainer.appendChild(removeRowBtn);
        buttonContainer.appendChild(importCSVBtn);
        buttonContainer.appendChild(saveCSVBtn);
        buttonContainer.appendChild(printBtn);
        
        // Add container to main container
        const container = document.querySelector('.container');
        container.appendChild(buttonContainer);
    }

    // Add draft management buttons
    addDraftButtons() {
        // Create Save Draft button
        const saveDraftBtn = document.createElement('button');
        saveDraftBtn.textContent = 'Save Draft';
        saveDraftBtn.className = 'save-draft-btn';
        saveDraftBtn.onclick = () => DraftUI.saveDraft();

        // Create View Drafts button
        const viewDraftsBtn = document.createElement('button');
        viewDraftsBtn.textContent = 'View Drafts';
        viewDraftsBtn.className = 'drafts-btn';
        viewDraftsBtn.onclick = () => DraftUI.openModal();

        // Add to existing button container
        const buttonContainer = document.querySelector('.button-container');
        if (buttonContainer) {
            buttonContainer.insertBefore(saveDraftBtn, buttonContainer.firstChild);
            buttonContainer.insertBefore(viewDraftsBtn, buttonContainer.firstChild);
        }
    }

    // Add company settings button
    addCompanySettingsButton() {
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '⚙️ Settings';
        settingsBtn.className = 'drafts-btn';
        settingsBtn.onclick = () => CompanySettings.openModal();

        // Add to existing button container
        const buttonContainer = document.querySelector('.button-container');
        if (buttonContainer) {
            // Insert after view drafts button (which should be the second child)
            const viewDraftsBtn = buttonContainer.children[1];
            if (viewDraftsBtn) {
                buttonContainer.insertBefore(settingsBtn, viewDraftsBtn.nextSibling);
            } else {
                buttonContainer.appendChild(settingsBtn);
            }
        }
    }

    // Set up event listeners
    setupEventListeners() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.id === 'draftModal') {
                DraftUI.closeModal();
            }
            if (e.target.id === 'companySettingsModal') {
                CompanySettings.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                DraftUI.openModal();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                DraftUI.saveDraft();
            }
            if (e.key === 'Escape') {
                DraftUI.closeModal();
                CompanySettings.closeModal();
            }
        });
    }

    // Initialize test functions for console debugging
    initializeTestFunctions() {
        this.testStorage = {
            // Save current invoice as draft
            saveCurrent: (name = 'Test Draft') => {
                const data = this.serializer.collectInvoiceData();
                const draftId = this.storageManager.saveDraft({
                    name: name,
                    status: 'draft',
                    data: data
                });
                console.log('Draft saved with ID:', draftId);
                return draftId;
            },
            
            // List all drafts
            listDrafts: () => {
                const drafts = this.storageManager.getAllDrafts();
                console.table(drafts.map(d => ({
                    id: d.id,
                    name: d.name,
                    status: d.status,
                    created: d.createdAt,
                    updated: d.updatedAt
                })));
                return drafts;
            },
            
            // Load a draft by ID
            loadDraft: (draftId) => {
                const draft = this.storageManager.getDraft(draftId);
                if (draft) {
                    this.serializer.restoreInvoiceData(draft.data);
                    console.log('Draft loaded:', draft.name);
                } else {
                    console.error('Draft not found');
                }
                return draft;
            },
            
            // Delete a draft
            deleteDraft: (draftId) => {
                this.storageManager.deleteDraft(draftId);
                console.log('Draft deleted');
            },
            
            // Check storage info
            storageInfo: () => {
                const info = this.storageManager.getStorageInfo();
                console.log(`Storage: ${(info.used/1024).toFixed(2)}KB / ${(info.max/1024/1024).toFixed(2)}MB (${info.percentUsed}%)`);
                if (info.warning) console.warn('Storage usage is high!');
                return info;
            },
            
            // Clear all drafts
            clearAll: () => {
                if (confirm('Delete all drafts?')) {
                    this.storageManager.clearAllDrafts();
                    console.log('All drafts cleared');
                }
            },
            
            // Storage diagnostics
            diagnostics: {
                testPersistence: () => {
                    const testKey = 'localStorage_test_' + Date.now();
                    const testData = { test: 'data', timestamp: new Date().toISOString() };
                    
                    try {
                        localStorage.setItem(testKey, JSON.stringify(testData));
                        const retrieved = JSON.parse(localStorage.getItem(testKey));
                        localStorage.removeItem(testKey);
                        
                        console.log('✅ localStorage basic test passed');
                        console.log('🔍 Current environment:');
                        console.log('  - Protocol:', window.location.protocol);
                        console.log('  - Host:', window.location.host);
                        console.log('  - User Agent:', navigator.userAgent.split(' ').pop());
                        
                        // Check storage quota
                        const info = this.storageManager.getStorageInfo();
                        console.log('  - Storage used:', (info.used / 1024).toFixed(2) + 'KB');
                        console.log('  - Storage limit:', (info.max / 1024 / 1024).toFixed(2) + 'MB');
                        
                        return true;
                    } catch (error) {
                        console.error('❌ localStorage test failed:', error);
                        return false;
                    }
                },
                
                checkDrafts: () => {
                    const drafts = this.storageManager.getAllDrafts();
                    console.log(`📁 Current drafts: ${drafts.length}`);
                    drafts.forEach(draft => {
                        console.log(`  - ${draft.name} (${draft.id})`);
                    });
                    
                    // Check raw localStorage
                    console.log('🔍 Raw localStorage keys:');
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith('invoice_') || key.startsWith('company_')) {
                            const size = localStorage.getItem(key).length;
                            console.log(`  - ${key}: ${size} characters`);
                        }
                    }
                },
                
                createTestDraft: () => {
                    const testId = this.testStorage.saveCurrent('🧪 Persistence Test - ' + new Date().toLocaleTimeString());
                    console.log('✅ Test draft created:', testId);
                    console.log('🔄 Close browser and reopen, then run testStorage.diagnostics.checkDrafts()');
                    return testId;
                }
            },

            // Auto-save test functions
            autoSave: {
                status: () => {
                    const status = this.autoSave?.getStatus();
                    console.log('Auto-save Status:', status);
                    return status;
                },
                
                enable: () => {
                    this.autoSave?.enable();
                    console.log('Auto-save enabled');
                },
                
                disable: () => {
                    this.autoSave?.disable();
                    console.log('Auto-save disabled');
                },
                
                saveNow: () => {
                    this.autoSave?.saveNow();
                    console.log('Manual auto-save triggered');
                },
                
                setInterval: (seconds) => {
                    this.autoSave?.setInterval(seconds);
                    console.log(`Auto-save interval set to ${seconds} seconds`);
                }
            },

            // Company settings test functions
            company: {
                getSettings: () => {
                    const settings = this.companySettings.getSettings();
                    console.log('Company Settings:', settings);
                    return settings;
                },
                
                updateSettings: (newSettings) => {
                    const updated = this.companySettings.updateSettings(newSettings);
                    console.log('Settings updated:', updated);
                    return updated;
                },
                
                generateInvoiceNumber: () => {
                    const number = this.companySettings.generateInvoiceNumber();
                    console.log('Next invoice number:', number);
                    return number;
                }
            }
        };

        // Make test functions globally accessible
        window.testStorage = this.testStorage;
        
        console.log('Test functions available:');
        console.log('- testStorage.saveCurrent()');
        console.log('- testStorage.listDrafts()');
        console.log('- testStorage.company.getSettings()');
        console.log('- testStorage.autoSave.status()');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvoiceApp;
}