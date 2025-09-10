/**
 * Auto-Save Module
 * Handles automatic saving of invoice drafts
 */

class AutoSave {
    constructor(storageManager, serializer) {
        this.storageManager = storageManager;
        this.serializer = serializer;
        this.timer = null;
        this.hideTimer = null;
        this.interval = 30000; // 30 seconds default
        this.isEnabled = true;
        this.isDirty = false;
        this.lastSaveData = null;
        this.autoSaveDraftId = null;
        this.lastSaveTime = null;
        this.statusElement = null;
        
        this.initializeAutoSave();
    }

    initializeAutoSave() {
        // Load settings
        const settings = this.storageManager.getSettings();
        this.isEnabled = settings.autoSaveEnabled !== false;
        this.interval = settings.autoSaveInterval || 30000;
        
        // Create status indicator
        this.createStatusIndicator();
        
        // Set up form change detection
        this.setupChangeDetection();
        
        // Start auto-save if enabled
        if (this.isEnabled) {
            this.startAutoSave();
        }
        
        // Try to restore auto-save draft on page load
        this.restoreAutoSave();
    }

    createStatusIndicator() {
        // Create auto-save status indicator
        const statusDiv = document.createElement('div');
        statusDiv.id = 'autoSaveStatus';
        statusDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 12px;
            color: #666;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 999;
            transition: all 0.3s;
            opacity: 0;
            pointer-events: none;
        `;
        document.body.appendChild(statusDiv);
        this.statusElement = statusDiv;
    }

    setupChangeDetection() {
        // Use event delegation to catch changes in dynamically added elements
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.markAsDirty();
            }
        });
        
        document.addEventListener('change', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.markAsDirty();
            }
        });

        // Monitor table changes (invoice items)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    this.markAsDirty();
                }
            });
        });

        const invoiceTable = document.getElementById('invoiceItems');
        if (invoiceTable) {
            observer.observe(invoiceTable, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }

    markAsDirty() {
        if (!this.isDirty) {
            this.isDirty = true;
            this.showStatus('Unsaved changes', '#f59e0b');
        }
    }

    startAutoSave() {
        this.stopAutoSave(); // Clear any existing timer
        
        if (this.isEnabled && this.interval > 0) {
            this.timer = setInterval(() => {
                this.performAutoSave();
            }, this.interval);
        }
    }

    stopAutoSave() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    async performAutoSave() {
        if (!this.isDirty || !this.isEnabled) {
            return;
        }

        try {
            const currentData = this.serializer.collectInvoiceData();
            
            // Check if data actually changed
            const dataString = JSON.stringify(currentData);
            if (dataString === this.lastSaveData) {
                return; // No changes detected
            }

            this.showStatus('Saving...', '#1e3a8a');

            // Create or update auto-save draft
            const draftName = `🔄 Auto-save - ${new Date().toLocaleString()}`;
            
            this.autoSaveDraftId = this.storageManager.saveDraft({
                name: draftName,
                status: 'auto-save',
                isAutoSave: true,
                data: currentData
            }, this.autoSaveDraftId);

            this.lastSaveData = dataString;
            this.lastSaveTime = new Date();
            this.isDirty = false;

            this.showStatus(`Auto-saved at ${this.lastSaveTime.toLocaleTimeString()}`, '#10b981');
            
            // Clean up old auto-save drafts (keep only latest)
            this.cleanupOldAutoSaves();

        } catch (error) {
            console.error('Auto-save failed:', error);
            this.showStatus('Auto-save failed', '#dc2626');
        }
    }

    cleanupOldAutoSaves() {
        try {
            const drafts = this.storageManager.getAllDrafts();
            const autoSaveDrafts = drafts
                // Only clean up drafts that are marked as auto-save AND not the current one
                // Don't delete drafts that were converted from auto-save (isAutoSave: false)
                .filter(d => d.isAutoSave === true && d.id !== this.autoSaveDraftId)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            
            // Delete old auto-saves (keep only current one)
            autoSaveDrafts.forEach(draft => {
                this.storageManager.deleteDraft(draft.id);
            });
        } catch (error) {
            console.error('Failed to cleanup auto-saves:', error);
        }
    }

    restoreAutoSave() {
        const drafts = this.storageManager.getAllDrafts();
        const autoSaveDraft = drafts.find(d => d.isAutoSave);
        
        if (autoSaveDraft) {
            // Show restoration prompt after a short delay
            setTimeout(() => {
                if (confirm(`Found auto-saved data from ${new Date(autoSaveDraft.updatedAt).toLocaleString()}. Would you like to restore it now?\n\n(Note: You can also find this draft in "View Drafts" later)`)) {
                    this.serializer.restoreInvoiceData(autoSaveDraft.data);
                    this.autoSaveDraftId = autoSaveDraft.id;
                    this.showStatus('Auto-save restored', '#10b981');
                } else {
                    // User declined immediate restoration, but keep the draft available
                    // Convert auto-save to regular draft so it appears in draft list
                    const regularDraft = {
                        ...autoSaveDraft,
                        name: `💾 Auto-saved - ${new Date(autoSaveDraft.updatedAt).toLocaleString()}`,
                        status: 'auto-saved',
                        isAutoSave: false // Make it a regular draft
                    };
                    this.storageManager.saveDraft(regularDraft, autoSaveDraft.id);
                    this.showStatus('Auto-save kept in drafts', '#1e3a8a');
                }
            }, 1000);
        }
    }

    showStatus(message, color = '#666') {
        if (!this.statusElement) return;
        
        this.statusElement.textContent = message;
        this.statusElement.style.color = color;
        this.statusElement.style.opacity = '1';
        
        // Clear any existing hide timer
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }
        
        // Auto-hide after 3 seconds only for success messages (not errors or unsaved changes)
        if (message.includes('Auto-saved at') && !message.includes('failed')) {
            this.hideTimer = setTimeout(() => {
                if (this.statusElement && !this.isDirty) {
                    this.statusElement.style.opacity = '0';
                }
            }, 3000);
        }
        // Keep "Unsaved changes", "Saving...", and error messages visible
    }

    // Public methods for manual control
    saveNow() {
        this.markAsDirty();
        this.performAutoSave();
    }

    enable() {
        this.isEnabled = true;
        this.storageManager.updateSettings({ autoSaveEnabled: true });
        this.startAutoSave();
        this.showStatus('Auto-save enabled', '#10b981');
    }

    disable() {
        this.isEnabled = false;
        this.storageManager.updateSettings({ autoSaveEnabled: false });
        this.stopAutoSave();
        this.showStatus('Auto-save disabled', '#f59e0b');
    }

    setInterval(seconds) {
        this.interval = seconds * 1000;
        this.storageManager.updateSettings({ autoSaveInterval: this.interval });
        if (this.isEnabled) {
            this.startAutoSave(); // Restart with new interval
        }
        this.showStatus(`Auto-save interval set to ${seconds} seconds`, '#1e3a8a');
    }

    setCurrentAutoSaveDraft(draftId) {
        // Set the current auto-save draft ID to reuse when auto-saving
        // This prevents creating duplicate auto-save drafts
        this.autoSaveDraftId = draftId;
        console.log('Auto-save will now update draft:', draftId);
    }

    getStatus() {
        return {
            enabled: this.isEnabled,
            interval: this.interval / 1000,
            isDirty: this.isDirty,
            lastSaveTime: this.lastSaveTime,
            autoSaveDraftId: this.autoSaveDraftId
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoSave;
}