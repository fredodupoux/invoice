/**
 * Draft Management UI Module
 * Handles the user interface for managing saved drafts
 */

class DraftUI {
    constructor(storageManager, serializer, autoSave) {
        this.storageManager = storageManager;
        this.serializer = serializer;
        this.autoSave = autoSave;
    }

    static openModal() {
        const modal = document.getElementById('draftModal');
        modal.classList.add('show');
        this.refreshDraftList();
        this.updateStorageInfo();
    }

    static closeModal() {
        const modal = document.getElementById('draftModal');
        modal.classList.remove('show');
    }

    static refreshDraftList() {
        const drafts = window.storageManager.getAllDrafts();
        const listContainer = document.getElementById('draftList');
        
        if (drafts.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-drafts">
                    <p>No saved drafts yet</p>
                    <p style="font-size: 14px; margin-top: 10px;">Save your first draft to see it here</p>
                </div>
            `;
            return;
        }

        // Sort drafts by updated date (newest first)
        drafts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        listContainer.innerHTML = drafts.map(draft => {
            const date = new Date(draft.updatedAt);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            const clientName = draft.data?.soldTo || 'No client specified';
            const invoiceNumber = draft.data?.invoiceNumber || 'No invoice number';
            const grandTotal = draft.data?.grandTotal || '$0.00';
            
            // Add special styling for auto-saved drafts
            const isAutoSaved = draft.status === 'auto-saved' || draft.isAutoSave;
            const itemClass = isAutoSaved ? 'draft-item auto-saved' : 'draft-item';

            return `
                <div class="${itemClass}">
                    <div class="draft-info">
                        <div class="draft-name">${draft.name}</div>
                        <div class="draft-meta">
                            Client: ${clientName} | 
                            Invoice: ${invoiceNumber} | 
                            Total: ${grandTotal} | 
                            Updated: ${formattedDate}
                        </div>
                    </div>
                    <div class="draft-actions">
                        <button class="draft-btn" onclick="DraftUI.loadDraft('${draft.id}')">Load</button>
                        <button class="draft-btn delete" onclick="DraftUI.deleteDraft('${draft.id}')">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    static updateStorageInfo() {
        const info = window.storageManager.getStorageInfo();
        const container = document.getElementById('storageInfo');
        
        const usedKB = (info.used / 1024).toFixed(2);
        const maxMB = (info.max / 1024 / 1024).toFixed(2);
        
        let barClass = 'storage-used';
        if (info.critical) barClass += ' critical';
        else if (info.warning) barClass += ' warning';

        container.innerHTML = `
            <div>Storage Usage: ${usedKB} KB / ${maxMB} MB (${info.percentUsed}%)</div>
            <div class="storage-bar">
                <div class="${barClass}" style="width: ${Math.min(info.percentUsed, 100)}%"></div>
            </div>
            ${info.warning ? '<div style="color: #f59e0b; margin-top: 5px;">⚠️ Storage is getting full</div>' : ''}
            ${info.critical ? '<div style="color: #dc2626; margin-top: 5px;">⚠️ Storage is almost full! Delete some drafts.</div>' : ''}
        `;
    }

    static saveDraft() {
        const name = prompt('Enter a name for this draft:', `Invoice - ${new Date().toLocaleDateString()}`);
        if (!name) return;

        try {
            const data = window.invoiceSerializer.collectInvoiceData();
            const validation = window.invoiceSerializer.validateInvoiceData(data);
            
            // Save even if validation fails (it's a draft)
            const draftId = window.storageManager.saveDraft({
                name: name,
                status: validation.isValid ? 'valid' : 'draft',
                data: data
            });
            
            alert(`Draft "${name}" saved successfully!`);
            
            // If modal is open, refresh the list
            if (document.getElementById('draftModal').classList.contains('show')) {
                this.refreshDraftList();
                this.updateStorageInfo();
            }
        } catch (error) {
            alert('Failed to save draft: ' + error.message);
        }
    }

    static loadDraft(draftId) {
        const draft = window.storageManager.getDraft(draftId);
        if (!draft) {
            alert('Draft not found');
            return;
        }

        if (confirm(`Load draft "${draft.name}"? This will replace current invoice data.`)) {
            window.invoiceSerializer.restoreInvoiceData(draft.data);
            
            // If loading an auto-saved draft, set it as the current auto-save draft
            // to prevent creating duplicates
            if (draft.isAutoSave || draft.status === 'auto-saved' || draft.name.includes('Auto-save')) {
                if (window.autoSave) {
                    window.autoSave.setCurrentAutoSaveDraft(draftId);
                }
            }
            
            this.closeModal();
            alert(`Draft "${draft.name}" loaded successfully!`);
        }
    }

    static deleteDraft(draftId) {
        const draft = window.storageManager.getDraft(draftId);
        if (!draft) return;

        if (confirm(`Delete draft "${draft.name}"? This cannot be undone.`)) {
            window.storageManager.deleteDraft(draftId);
            this.refreshDraftList();
            this.updateStorageInfo();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DraftUI;
}