/**
 * Company Settings Module
 * Handles company configuration and settings management
 */

class CompanySettings {
    constructor(storageManager) {
        this.storageManager = storageManager;
    }

    // Get current company settings
    getSettings() {
        return this.storageManager.getCompanySettings();
    }

    // Update company settings
    updateSettings(newSettings) {
        const updated = this.storageManager.updateCompanySettings(newSettings);
        this.applySettingsToInvoice(updated);
        return updated;
    }

    // Apply company settings to the current invoice display
    applySettingsToInvoice(settings) {
        if (!settings) settings = this.getSettings();
        
        // Update company name
        const companyNameElement = document.querySelector('.company-name');
        if (companyNameElement && settings.name) {
            companyNameElement.textContent = settings.name;
        }

        // Update page title
        const pageTitleElement = document.getElementById('pageTitle');
        if (pageTitleElement && settings.name) {
            pageTitleElement.textContent = `${settings.name} Invoice Template`;
        }

        // Update logo (if element exists)
        const logoElement = document.querySelector('.logo');
        if (logoElement && settings.logo) {
            logoElement.src = settings.logo;
        }
        
        // Also update printable section logo
        const printableLogoElement = document.querySelector('#printableInvoice .logo');
        if (printableLogoElement && settings.logo) {
            printableLogoElement.src = settings.logo;
        }

        // Update company info section (create if doesn't exist)
        this.updateCompanyInfoDisplay(settings);
    }

    // Update or create company info display section
    updateCompanyInfoDisplay(settings) {
        let companyInfoElement = document.querySelector('.company-info');
        
        if (!companyInfoElement) {
            // Create company info element if it doesn't exist
            companyInfoElement = document.createElement('div');
            companyInfoElement.className = 'company-info';
            
            // Find a good place to insert it (in the header)
            const header = document.querySelector('.header');
            if (header) {
                header.appendChild(companyInfoElement);
            }
        }

        // Build company info HTML
        let infoHTML = '';
        if (settings.address) infoHTML += `<div>${settings.address}</div>`;
        if (settings.phone) infoHTML += `<div>Phone: ${settings.phone}</div>`;
        if (settings.email) infoHTML += `<div>Email: ${settings.email}</div>`;
        if (settings.website) infoHTML += `<div>Website: ${settings.website}</div>`;

        companyInfoElement.innerHTML = infoHTML;
    }

    // Generate next invoice number based on settings
    generateInvoiceNumber() {
        const settings = this.getSettings();
        const prefix = settings.invoicePrefix || 'INV';
        const startNumber = settings.invoiceStartNumber || 1;
        
        // Get existing drafts to find the highest invoice number
        const drafts = this.storageManager.getAllDrafts();
        let maxNumber = startNumber - 1;
        
        drafts.forEach(draft => {
            if (draft.data?.invoiceNumber) {
                const match = draft.data.invoiceNumber.match(new RegExp(`^${prefix}(\\d+)$`));
                if (match) {
                    const num = parseInt(match[1]);
                    if (num > maxNumber) maxNumber = num;
                }
            }
        });
        
        return `${prefix}${(maxNumber + 1).toString().padStart(4, '0')}`;
    }

    // Calculate tax based on company settings
    calculateTax(subtotal) {
        const settings = this.getSettings();
        const taxRate = settings.taxRate || 0;
        return (subtotal * taxRate / 100);
    }

    // Open company settings modal
    static openModal() {
        let modal = document.getElementById('companySettingsModal');
        if (!modal) {
            CompanySettings.createSettingsModal();
            modal = document.getElementById('companySettingsModal');
        }
        
        // Populate form with current settings
        CompanySettings.populateSettingsForm();
        
        modal.classList.add('show');
    }

    // Close company settings modal
    static closeModal() {
        const modal = document.getElementById('companySettingsModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Create the settings modal HTML
    static createSettingsModal() {
        const modalHTML = `
            <div id="companySettingsModal" class="draft-modal">
                <div class="draft-modal-content">
                    <div class="draft-modal-header">
                        <h2 class="draft-modal-title">Company Settings</h2>
                        <button class="close-modal" onclick="CompanySettings.closeModal()">&times;</button>
                    </div>
                    <div class="settings-form">
                        <div class="form-section">
                            <h3>Company Information</h3>
                            <div class="form-group">
                                <label for="companyLogoInput">Company Logo:</label>
                                <div class="logo-upload-section">
                                    <div class="current-logo-preview">
                                        <img id="logoPreview" src="" alt="Current Logo" style="max-width: 150px; max-height: 100px; object-fit: contain; border: 1px solid #ddd; border-radius: 4px; display: none;">
                                    </div>
                                    <div class="logo-upload-controls">
                                        <input type="file" id="companyLogoInput" accept="image/*" style="display: none;">
                                        <button type="button" class="btn btn-outline" onclick="CompanySettings.selectLogo()">Choose Logo</button>
                                        <button type="button" class="btn btn-outline" onclick="CompanySettings.removeLogo()" id="removeLogoBtn" style="display: none;">Remove Logo</button>
                                    </div>
                                    <small class="form-text">Supported formats: JPG, PNG, GIF. Maximum size: 2MB.</small>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="companyNameInput">Company Name:</label>
                                <input type="text" id="companyNameInput" class="form-control" placeholder="Enter company name">
                            </div>
                            <div class="form-group">
                                <label for="companyAddressInput">Address:</label>
                                <textarea id="companyAddressInput" class="form-control" rows="3" placeholder="Enter company address"></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="companyPhoneInput">Phone:</label>
                                    <input type="tel" id="companyPhoneInput" class="form-control" placeholder="Enter phone number">
                                </div>
                                <div class="form-group">
                                    <label for="companyEmailInput">Email:</label>
                                    <input type="email" id="companyEmailInput" class="form-control" placeholder="Enter email address">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="companyWebsiteInput">Website:</label>
                                <input type="url" id="companyWebsiteInput" class="form-control" placeholder="Enter website URL">
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Invoice Settings</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="invoicePrefixInput">Invoice Prefix:</label>
                                    <input type="text" id="invoicePrefixInput" class="form-control" placeholder="INV" maxlength="10">
                                </div>
                                <div class="form-group">
                                    <label for="invoiceStartNumberInput">Starting Number:</label>
                                    <input type="number" id="invoiceStartNumberInput" class="form-control" min="1" placeholder="1">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="taxRateInput">Default Tax Rate (%):</label>
                                <input type="number" id="taxRateInput" class="form-control" min="0" max="100" step="0.01" placeholder="0">
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-primary" onclick="CompanySettings.saveSettings()">Save Settings</button>
                            <button type="button" class="btn btn-secondary" onclick="CompanySettings.closeModal()">Cancel</button>
                            <button type="button" class="btn btn-outline" onclick="CompanySettings.resetToDefaults()">Reset to Defaults</button>
                        </div>
                        
                        <div class="profile-actions-section">
                            <hr>
                            <h3>Company Profiles</h3>
                            <div class="profile-form-actions">
                                <button type="button" class="btn btn-outline" onclick="CompanySettings.saveAsProfile()">💾 Save as Profile</button>
                                <button type="button" class="btn btn-outline" onclick="CompanySettings.openProfilesModal(); CompanySettings.closeModal();">📂 Manage Profiles</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Populate the settings form with current values
    static populateSettingsForm() {
        const settings = window.companySettings.getSettings();
        
        // Populate logo preview
        const logoPreview = document.getElementById('logoPreview');
        const removeLogoBtn = document.getElementById('removeLogoBtn');
        if (settings.logo) {
            logoPreview.src = settings.logo;
            logoPreview.style.display = 'block';
            removeLogoBtn.style.display = 'inline-block';
        } else {
            logoPreview.style.display = 'none';
            removeLogoBtn.style.display = 'none';
        }
        
        document.getElementById('companyNameInput').value = settings.name || '';
        document.getElementById('companyAddressInput').value = settings.address || '';
        document.getElementById('companyPhoneInput').value = settings.phone || '';
        document.getElementById('companyEmailInput').value = settings.email || '';
        document.getElementById('companyWebsiteInput').value = settings.website || '';
        document.getElementById('invoicePrefixInput').value = settings.invoicePrefix || 'INV';
        document.getElementById('invoiceStartNumberInput').value = settings.invoiceStartNumber || 1;
        document.getElementById('taxRateInput').value = settings.taxRate || 0;
    }

    // Save settings from the form
    static saveSettings() {
        const settings = window.companySettings.getSettings();
        const newSettings = {
            name: document.getElementById('companyNameInput').value,
            address: document.getElementById('companyAddressInput').value,
            phone: document.getElementById('companyPhoneInput').value,
            email: document.getElementById('companyEmailInput').value,
            website: document.getElementById('companyWebsiteInput').value,
            invoicePrefix: document.getElementById('invoicePrefixInput').value || 'INV',
            invoiceStartNumber: parseInt(document.getElementById('invoiceStartNumberInput').value) || 1,
            taxRate: parseFloat(document.getElementById('taxRateInput').value) || 0,
            logo: settings.logo // Preserve current logo (updated through separate upload process)
        };
        
        window.companySettings.updateSettings(newSettings);
        
        alert('Company settings saved successfully!');
        CompanySettings.closeModal();
    }

    // Reset to default settings
    static resetToDefaults() {
        if (confirm('Reset all company settings to defaults? This cannot be undone.')) {
            const defaultSettings = {
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
            
            window.companySettings.updateSettings(defaultSettings);
            CompanySettings.populateSettingsForm();
            
            alert('Settings reset to defaults!');
        }
    }

    // Open file selector for logo upload
    static selectLogo() {
        const fileInput = document.getElementById('companyLogoInput');
        fileInput.click();
        
        // Set up file change handler if not already done
        if (!fileInput.hasEventListener) {
            fileInput.addEventListener('change', CompanySettings.handleLogoUpload);
            fileInput.hasEventListener = true;
        }
    }

    // Handle logo file upload
    static handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file (JPG, PNG, GIF).');
            return;
        }

        // Validate file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB.');
            return;
        }

        // Read file as data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoDataUrl = e.target.result;
            
            // Update preview
            const logoPreview = document.getElementById('logoPreview');
            const removeLogoBtn = document.getElementById('removeLogoBtn');
            logoPreview.src = logoDataUrl;
            logoPreview.style.display = 'block';
            removeLogoBtn.style.display = 'inline-block';
            
            // Save logo to settings immediately
            const currentSettings = window.companySettings.getSettings();
            currentSettings.logo = logoDataUrl;
            window.companySettings.updateSettings(currentSettings);
            
            // Clear the file input for future uploads
            event.target.value = '';
        };
        
        reader.onerror = function() {
            alert('Error reading file. Please try again.');
        };
        
        reader.readAsDataURL(file);
    }

    // Remove current logo
    static removeLogo() {
        if (confirm('Remove the current logo?')) {
            const logoPreview = document.getElementById('logoPreview');
            const removeLogoBtn = document.getElementById('removeLogoBtn');
            
            logoPreview.style.display = 'none';
            removeLogoBtn.style.display = 'none';
            
            // Update settings
            const currentSettings = window.companySettings.getSettings();
            currentSettings.logo = '';
            window.companySettings.updateSettings(currentSettings);
        }
    }

    // Save current company settings as a profile
    static saveAsProfile() {
        const profileName = prompt('Enter a name for this company profile:');
        if (!profileName || profileName.trim() === '') {
            return;
        }

        try {
            const currentSettings = window.companySettings.getSettings();
            const profileId = window.storageManager.saveCompanyProfile(currentSettings, profileName.trim());
            alert(`Company profile "${profileName}" saved successfully!`);
            
            // Refresh profiles list if modal is open
            const profilesModal = document.getElementById('companyProfilesModal');
            if (profilesModal && profilesModal.classList.contains('show')) {
                CompanySettings.populateProfilesList();
            }
        } catch (error) {
            alert(`Error saving profile: ${error.message}`);
        }
    }

    // Open company profiles manager
    static openProfilesModal() {
        let modal = document.getElementById('companyProfilesModal');
        if (!modal) {
            CompanySettings.createProfilesModal();
            modal = document.getElementById('companyProfilesModal');
        }
        
        CompanySettings.populateProfilesList();
        modal.classList.add('show');
    }

    // Close company profiles modal
    static closeProfilesModal() {
        const modal = document.getElementById('companyProfilesModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Create the company profiles modal
    static createProfilesModal() {
        const modalHTML = `
            <div id="companyProfilesModal" class="draft-modal">
                <div class="draft-modal-content">
                    <div class="draft-modal-header">
                        <h2 class="draft-modal-title">Company Profiles</h2>
                        <button class="close-modal" onclick="CompanySettings.closeProfilesModal()">&times;</button>
                    </div>
                    <div class="profiles-content">
                        <div class="profiles-actions">
                            <button type="button" class="btn btn-primary" onclick="CompanySettings.saveAsProfile()">
                                💾 Save Current as Profile
                            </button>
                        </div>
                        <div class="profiles-list" id="profilesList">
                            <!-- Profiles will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Populate the profiles list
    static populateProfilesList() {
        const profilesList = document.getElementById('profilesList');
        if (!profilesList) return;

        const profiles = window.storageManager.getAllCompanyProfiles();
        
        if (profiles.length === 0) {
            profilesList.innerHTML = `
                <div class="no-profiles">
                    <p>No saved company profiles yet.</p>
                    <p>Save your current company settings as a profile to get started!</p>
                </div>
            `;
            return;
        }

        const profilesHTML = profiles.map(profile => `
            <div class="profile-card" data-profile-id="${profile.id}">
                <div class="profile-info">
                    <h4 class="profile-name">${profile.name || 'Unnamed Company'}</h4>
                    <p class="profile-details">
                        ${profile.address ? profile.address.split('\n')[0] : 'No address'}
                        ${profile.phone ? `• ${profile.phone}` : ''}
                    </p>
                    <p class="profile-meta">
                        Saved: ${new Date(profile.savedAt).toLocaleDateString()}
                        ${profile.invoicePrefix ? `• Prefix: ${profile.invoicePrefix}` : ''}
                    </p>
                </div>
                <div class="profile-actions">
                    <button class="btn btn-primary btn-sm" onclick="CompanySettings.loadProfile('${profile.id}')">
                        📂 Load
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="CompanySettings.deleteProfile('${profile.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');

        profilesList.innerHTML = profilesHTML;
    }

    // Load a company profile
    static loadProfile(profileId) {
        if (confirm('Load this company profile? This will replace your current company settings.')) {
            try {
                const loadedSettings = window.storageManager.loadCompanyProfile(profileId);
                if (loadedSettings) {
                    // Apply the loaded settings
                    window.companySettings.applySettingsToInvoice(loadedSettings);
                    
                    // Update the company settings form if it's open
                    const settingsModal = document.getElementById('companySettingsModal');
                    if (settingsModal && settingsModal.classList.contains('show')) {
                        CompanySettings.populateSettingsForm();
                    }
                    
                    alert('Company profile loaded successfully!');
                    CompanySettings.closeProfilesModal();
                } else {
                    alert('Error loading company profile.');
                }
            } catch (error) {
                alert(`Error loading profile: ${error.message}`);
            }
        }
    }

    // Delete a company profile
    static deleteProfile(profileId) {
        const profile = window.storageManager.getCompanyProfile(profileId);
        if (!profile) return;

        if (confirm(`Delete the company profile "${profile.name}"? This cannot be undone.`)) {
            try {
                window.storageManager.deleteCompanyProfile(profileId);
                alert('Company profile deleted successfully!');
                CompanySettings.populateProfilesList();
            } catch (error) {
                alert(`Error deleting profile: ${error.message}`);
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompanySettings;
}