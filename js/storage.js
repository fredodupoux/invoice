/**
 * Storage Management Module
 * Handles all localStorage operations for invoice drafts
 */

class InvoiceStorageManager {
    constructor() {
        this.STORAGE_KEY = 'invoice_drafts';
        this.SETTINGS_KEY = 'invoice_settings';
        this.COMPANY_KEY = 'company_settings';
        this.COMPANY_PROFILES_KEY = 'company_profiles';
        this.VERSION = '1.0.0';
        this.initializeStorage();
    }

    // Initialize storage structure if not exists
    initializeStorage() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const initialData = {
                drafts: {},
                version: this.VERSION
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
        }
        
        if (!localStorage.getItem(this.SETTINGS_KEY)) {
            const initialSettings = {
                autoSaveEnabled: true,
                autoSaveInterval: 30000,
                lastBackupDate: null
            };
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(initialSettings));
        }

        if (!localStorage.getItem(this.COMPANY_KEY)) {
            const defaultCompany = {
                name: 'US AGRICOM',
                logo: 'assets/images/usa-logo.png',
                address: '',
                phone: '',
                email: '',
                website: '',
                taxRate: 0,
                invoicePrefix: 'INV',
                invoiceStartNumber: 1
            };
            localStorage.setItem(this.COMPANY_KEY, JSON.stringify(defaultCompany));
        }

        if (!localStorage.getItem(this.COMPANY_PROFILES_KEY)) {
            const initialProfiles = {
                profiles: {},
                version: this.VERSION
            };
            localStorage.setItem(this.COMPANY_PROFILES_KEY, JSON.stringify(initialProfiles));
        }
    }

    // Generate unique ID for drafts
    generateId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `draft_${timestamp}_${random}`;
    }

    // Save a draft
    saveDraft(draftData, draftId = null) {
        try {
            const storage = this.getStorage();
            const id = draftId || this.generateId();
            
            storage.drafts[id] = {
                id: id,
                ...draftData,
                updatedAt: new Date().toISOString()
            };
            
            if (!draftData.createdAt) {
                storage.drafts[id].createdAt = new Date().toISOString();
            }
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
            return id;
        } catch (e) {
            console.error('Failed to save draft:', e);
            if (e.name === 'QuotaExceededError') {
                throw new Error('Storage quota exceeded. Please delete some drafts.');
            }
            throw e;
        }
    }

    // Get all drafts
    getAllDrafts() {
        const storage = this.getStorage();
        return Object.values(storage.drafts);
    }

    // Get a specific draft
    getDraft(draftId) {
        const storage = this.getStorage();
        return storage.drafts[draftId] || null;
    }

    // Delete a draft
    deleteDraft(draftId) {
        const storage = this.getStorage();
        delete storage.drafts[draftId];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
    }

    // Get storage data
    getStorage() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : { drafts: {}, version: this.VERSION };
    }

    // Get settings
    getSettings() {
        const data = localStorage.getItem(this.SETTINGS_KEY);
        return data ? JSON.parse(data) : {
            autoSaveEnabled: true,
            autoSaveInterval: 30000,
            lastBackupDate: null
        };
    }

    // Update settings
    updateSettings(settings) {
        const currentSettings = this.getSettings();
        const updatedSettings = { ...currentSettings, ...settings };
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updatedSettings));
    }

    // Get company settings
    getCompanySettings() {
        const data = localStorage.getItem(this.COMPANY_KEY);
        return data ? JSON.parse(data) : null;
    }

    // Update company settings
    updateCompanySettings(settings) {
        const currentSettings = this.getCompanySettings() || {};
        const updatedSettings = { ...currentSettings, ...settings };
        localStorage.setItem(this.COMPANY_KEY, JSON.stringify(updatedSettings));
        return updatedSettings;
    }

    // Check storage capacity
    getStorageInfo() {
        const used = new Blob([JSON.stringify(localStorage)]).size;
        const estimatedMax = 5 * 1024 * 1024; // 5MB estimate
        const percentUsed = (used / estimatedMax) * 100;
        
        return {
            used: used,
            max: estimatedMax,
            percentUsed: percentUsed.toFixed(2),
            available: estimatedMax - used,
            warning: percentUsed > 80,
            critical: percentUsed > 90
        };
    }

    // Clear all drafts
    clearAllDrafts() {
        const storage = this.getStorage();
        storage.drafts = {};
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
    }

    // Export all data
    exportData() {
        return {
            storage: this.getStorage(),
            settings: this.getSettings(),
            company: this.getCompanySettings(),
            exportDate: new Date().toISOString()
        };
    }

    // Import data
    importData(data) {
        if (data.storage) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data.storage));
        }
        if (data.settings) {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data.settings));
        }
        if (data.company) {
            localStorage.setItem(this.COMPANY_KEY, JSON.stringify(data.company));
        }
    }

    // Generate unique ID for company profiles
    generateCompanyProfileId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 6);
        return `company_${timestamp}_${random}`;
    }

    // Save a company profile
    saveCompanyProfile(profileData, profileName = null) {
        try {
            const storage = this.getCompanyProfiles();
            const name = profileName || profileData.name || 'Unnamed Company';
            const id = this.generateCompanyProfileId();
            
            storage.profiles[id] = {
                id: id,
                name: name,
                ...profileData,
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem(this.COMPANY_PROFILES_KEY, JSON.stringify(storage));
            return id;
        } catch (e) {
            console.error('Failed to save company profile:', e);
            if (e.name === 'QuotaExceededError') {
                throw new Error('Storage quota exceeded. Please delete some company profiles.');
            }
            throw e;
        }
    }

    // Get all company profiles
    getAllCompanyProfiles() {
        const storage = this.getCompanyProfiles();
        return Object.values(storage.profiles);
    }

    // Get a specific company profile
    getCompanyProfile(profileId) {
        const storage = this.getCompanyProfiles();
        return storage.profiles[profileId] || null;
    }

    // Delete a company profile
    deleteCompanyProfile(profileId) {
        const storage = this.getCompanyProfiles();
        delete storage.profiles[profileId];
        localStorage.setItem(this.COMPANY_PROFILES_KEY, JSON.stringify(storage));
    }

    // Get company profiles storage data
    getCompanyProfiles() {
        const data = localStorage.getItem(this.COMPANY_PROFILES_KEY);
        return data ? JSON.parse(data) : { profiles: {}, version: this.VERSION };
    }

    // Load a company profile as current settings
    loadCompanyProfile(profileId) {
        const profile = this.getCompanyProfile(profileId);
        if (profile) {
            // Extract only the company settings, excluding metadata
            const { id, savedAt, ...companySettings } = profile;
            this.updateCompanySettings(companySettings);
            return companySettings;
        }
        return null;
    }

    // Update an existing company profile
    updateCompanyProfile(profileId, profileData) {
        const storage = this.getCompanyProfiles();
        if (storage.profiles[profileId]) {
            storage.profiles[profileId] = {
                ...storage.profiles[profileId],
                ...profileData,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem(this.COMPANY_PROFILES_KEY, JSON.stringify(storage));
            return storage.profiles[profileId];
        }
        return null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvoiceStorageManager;
}