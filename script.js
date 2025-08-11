// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Section filtering functionality
    const progressItems = document.querySelectorAll('.progress-item');
    const taskCards = document.querySelectorAll('.task-card');
    const breadcrumbText = document.getElementById('breadcrumb-text');
    
    // Sidesheet functionality
    const sidesheetOverlay = document.getElementById('sidesheet-overlay');
    const closeSidesheet = document.getElementById('close-sidesheet');
    const editButton = document.getElementById('edit-button');
    const sidesheetContainer = document.getElementById('sidesheet-container');
    
    // Budget sidesheet elements
    const budgetSidesheetOverlay = document.getElementById('budget-sidesheet-overlay');
    const closeBudgetSidesheet = document.getElementById('close-budget-sidesheet');
    const acceptBudgetButton = document.getElementById('approve-budget');
    
    // Comment system elements
    const commentTextarea = document.getElementById('comment-textarea');
    const sendCommentButton = document.getElementById('send-comment');
    const cancelCommentButton = document.getElementById('cancel-comment');
    const activityFeed = document.getElementById('activity-feed');
    
    // Form elements
    const formInputs = document.querySelectorAll('.form-input-text input, .form-input-textarea textarea');
    const yesNoButtons = document.querySelectorAll('.yes-no-button');
    
    // Section mapping for breadcrumb updates
    const sectionMapping = {
        'budget': 'Budget & CTA',
        'doc-collection': 'Document Collection',
        'site-initiation': 'Site Initiation',
        'supplies-training': 'Supplies & Training',
        'site-activation': 'Site Activation'
    };
    
    // Function to filter sections
    function filterSection(sectionId) {
        console.log('Filtering section:', sectionId, 'Called from:', new Error().stack.split('\n')[2]);
        
        // Update progress tracker active state (only for title and badge, not the bar)
        progressItems.forEach(item => {
            item.classList.remove('active');
            const itemSection = item.getAttribute('data-section');
            if (itemSection === sectionId) {
                item.classList.add('active');
                console.log('Added active class to:', itemSection);
            }
        });
        
        // Remove active class from all progress badges first
        const allProgressBadges = document.querySelectorAll('.progress-badge');
        allProgressBadges.forEach(badge => {
            badge.classList.remove('active');
        });
        
        // Update progress badge active state for the selected section (but NOT the progress bar)
        const activeProgressItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeProgressItem) {
            const progressBadge = activeProgressItem.querySelector('.progress-badge');
            
            if (progressBadge) {
                progressBadge.classList.add('active');
            }
        }
        
        // Hide all task cards
        taskCards.forEach(card => {
            card.classList.add('hidden');
            card.classList.remove('visible');
        });
        
        // Show only the selected section tasks
        const targetTasks = document.querySelectorAll(`[data-section="${sectionId}"]`);
        targetTasks.forEach(task => {
            if (task.classList.contains('task-card')) {
                task.classList.remove('hidden');
                task.classList.add('visible');
            }
        });
        
        // Update breadcrumb text
        if (breadcrumbText && sectionMapping[sectionId]) {
            breadcrumbText.textContent = sectionMapping[sectionId];
        }
        
        console.log(`Filtered to show: ${sectionMapping[sectionId]}`);
    }
    
    // Function to close all sidesheets
    function closeAllSidesheets() {
        // Close feasibility sidesheet
        if (sidesheetOverlay) {
            sidesheetOverlay.classList.remove('active');
        }
        
        // Close budget sidesheet
        if (budgetSidesheetOverlay) {
            budgetSidesheetOverlay.classList.remove('active');
        }
        
        // Close point of contacts sidesheet
        const pointOfContactsOverlay = document.getElementById('point-of-contacts-sidesheet-overlay');
        if (pointOfContactsOverlay) {
            pointOfContactsOverlay.classList.remove('active');
        }
        
        // Close regulatory documents sidesheet
        const regulatoryDocumentsOverlay = document.getElementById('regulatory-documents-sidesheet-overlay');
        if (regulatoryDocumentsOverlay) {
            regulatoryDocumentsOverlay.classList.remove('active');
        }
        
        // Close Form 1572 sidesheet
        const form1572Overlay = document.getElementById('form-1572-sidesheet-overlay');
        if (form1572Overlay) {
            form1572Overlay.classList.remove('active');
        }
        
        // Close supplies sidesheet
        const suppliesSidesheet = document.getElementById('supplies-sidesheet');
        if (suppliesSidesheet) {
            suppliesSidesheet.classList.remove('active');
        }
        
        // Close portal training sidesheet
        const portalTrainingSidesheet = document.getElementById('portal-training-sidesheet');
        if (portalTrainingSidesheet) {
            portalTrainingSidesheet.classList.remove('active');
        }
        
        // Close site activation sidesheet
        const siteActivationSidesheet = document.getElementById('site-activation-sidesheet');
        if (siteActivationSidesheet) {
            siteActivationSidesheet.classList.remove('active');
        }
        
        // Restore scrolling
        document.body.style.overflow = '';
    }
    
    // Function to open sidesheet
    function openSidesheet(taskType) {
        console.log('openSidesheet called with taskType:', taskType);
        
        // Close all sidesheets first to ensure only one is open at a time
        closeAllSidesheets();
        
        if (taskType === 'feasibility') {
            sidesheetOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Opened feasibility questionnaire sidesheet');
        } else if (taskType === 'budget-cta') {
            budgetSidesheetOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Opened budget & CTA sidesheet');
        } else if (taskType === 'point-of-contacts') {
            console.log('Opening Point of Contacts sidesheet...');
            openPointOfContactsSidesheet();
        } else if (taskType === 'regulatory-documents') {
            console.log('Opening Regulatory Documents sidesheet...');
            openRegulatoryDocumentsSidesheet();
        } else if (taskType === 'confirm-supplies') {
            console.log('Opening Supplies sidesheet...');
            openSuppliesSidesheet();
        } else if (taskType === 'confirm-portal-training') {
            console.log('Opening Portal Training sidesheet...');
            openPortalTrainingSidesheet();
        } else if (taskType === 'site-activation-letter') {
            console.log('Opening Site Activation Letter sidesheet...');
            openSiteActivationSidesheet();
        } else {
            console.log('Unknown taskType:', taskType);
        }
    }
    
    // Function to close sidesheet
    function closeSidesheetFunc() {
        sidesheetOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        // Reset to view mode when closing
        setViewMode();
        console.log('Closed sidesheet');
    }
    
    // Function to close budget sidesheet
    function closeBudgetSidesheetFunc() {
        budgetSidesheetOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        console.log('Closed budget sidesheet');
    }
    
    // Function to open regulatory documents sidesheet
    function openRegulatoryDocumentsSidesheet() {
        console.log('=== openRegulatoryDocumentsSidesheet called ===');
        const sidesheetOverlay = document.getElementById('regulatory-documents-sidesheet-overlay');
        console.log('Found regulatory sidesheet overlay:', sidesheetOverlay);
        console.log('Regulatory overlay ID:', sidesheetOverlay ? sidesheetOverlay.id : 'NOT FOUND');
        
        if (sidesheetOverlay) {
            sidesheetOverlay.classList.add('active');
            sidesheetOverlay.style.display = 'flex'; // Force display
            sidesheetOverlay.style.zIndex = '1000'; // Ensure it's on top
            document.body.style.overflow = 'hidden';
            console.log('Added active class to regulatory sidesheet overlay');
            console.log('Regulatory overlay classes after adding active:', sidesheetOverlay.className);
            console.log('Regulatory overlay display style:', sidesheetOverlay.style.display);
            console.log('Regulatory overlay computed display:', window.getComputedStyle(sidesheetOverlay).display);
            console.log('Opened regulatory documents sidesheet');
        } else {
            console.log('ERROR: Regulatory documents sidesheet overlay not found!');
        }
    }
    
    // Function to close regulatory documents sidesheet
    function closeRegulatoryDocumentsSidesheet() {
        console.log('=== closeRegulatoryDocumentsSidesheet called ===');
        const sidesheetOverlay = document.getElementById('regulatory-documents-sidesheet-overlay');
        console.log('Found regulatory sidesheet overlay to close:', sidesheetOverlay);
        
        if (sidesheetOverlay) {
            sidesheetOverlay.classList.remove('active');
            sidesheetOverlay.style.display = 'none'; // Force hide
            document.body.style.overflow = '';
            console.log('Closed regulatory documents sidesheet');
            console.log('Overlay classes after closing:', sidesheetOverlay.className);
        } else {
            console.log('ERROR: Could not find regulatory documents sidesheet overlay to close!');
        }
    }
    
    function openForm1572Sidesheet() {
        console.log('=== openForm1572Sidesheet called ===');
        closeAllSidesheets();
        const sidesheetOverlay = document.getElementById('form-1572-sidesheet-overlay');
        if (sidesheetOverlay) {
            console.log('Found Form 1572 sidesheet overlay:', sidesheetOverlay);
            sidesheetOverlay.classList.add('active');
            sidesheetOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('Added active class to Form 1572 sidesheet overlay');
        } else {
            console.log('ERROR: Form 1572 sidesheet overlay not found!');
        }
    }
    
    function closeForm1572Sidesheet() {
        console.log('=== closeForm1572Sidesheet called ===');
        const sidesheetOverlay = document.getElementById('form-1572-sidesheet-overlay');
        if (sidesheetOverlay) {
            console.log('Found Form 1572 sidesheet overlay to close:', sidesheetOverlay);
            sidesheetOverlay.classList.remove('active');
            sidesheetOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('Form 1572 overlay classes after closing:', sidesheetOverlay.className);
        } else {
            console.log('ERROR: Could not find Form 1572 sidesheet overlay to close!');
        }
    }

    function handleSignatureSubmission() {
        console.log('=== handleSignatureSubmission called ===');
        
        const signatureFormSection = document.getElementById('signature-form-section');
        const signedSection = document.getElementById('signed-section');
        const submitBtn = document.getElementById('submit-signature-btn');
        
        if (signatureFormSection && signedSection && submitBtn) {
            // Disable submit button to prevent multiple submissions
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Simulate processing delay
            setTimeout(() => {
                // Fade out the signature form
                signatureFormSection.classList.add('fade-out');
                
                setTimeout(() => {
                    // Hide signature form and show signed section
                    signatureFormSection.style.display = 'none';
                    signedSection.style.display = 'flex';
                    signedSection.classList.add('fade-in');
                    
                    // Update the Form 1572 item status in the regulatory documents list
                    updateForm1572Status();
                    
                    console.log('Signature submitted successfully');
                }, 300); // Wait for fade out animation
                
            }, 1000); // Simulate processing time
        } else {
            console.log('ERROR: Could not find signature form elements!');
        }
    }

    function updateForm1572Status() {
        const form1572Item = document.getElementById('form-1572-item');
        if (form1572Item) {
            // Update the document status to completed
            const statusElement = form1572Item.querySelector('.document-status');
            if (statusElement) {
                statusElement.className = 'document-status completed';
                statusElement.innerHTML = `
                    <div class="status-badge">
                        <img src="./assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg" alt="Check" width="16" height="16">
                        <span>Completed Sep 30, 2025</span>
                    </div>
                `;
            }
            
            // Update the document icon to completed
            const iconElement = form1572Item.querySelector('.document-icon img');
            if (iconElement) {
                iconElement.src = './assets/bc64d3813d46a4c401f1483207e7f0e8e21ac561.svg';
                iconElement.alt = 'Completed';
            }
            
            console.log('Form 1572 status updated to completed');
        }

        // Mark the regulatory documents task as completed
        const regulatoryDocumentsTask = document.querySelector('[data-task="regulatory-documents"]');
        if (regulatoryDocumentsTask) {
            // Check if all regulatory documents are completed
            const allRegulatoryDocuments = document.querySelectorAll('#regulatory-documents-sidesheet-container .regulatory-document-item');
            const completedDocuments = document.querySelectorAll('#regulatory-documents-sidesheet-container .regulatory-document-item .document-status.completed');
            
            if (allRegulatoryDocuments.length > 0 && completedDocuments.length === allRegulatoryDocuments.length) {
                // All regulatory documents are completed, mark the task as complete
                regulatoryDocumentsTask.classList.remove('pending');
                regulatoryDocumentsTask.classList.add('completed');
                
                const taskStatusElement = regulatoryDocumentsTask.querySelector('.task-status');
                if (taskStatusElement) {
                    taskStatusElement.classList.remove('pending');
                    taskStatusElement.classList.add('completed');
                    taskStatusElement.innerHTML = `
                        <span>Completed</span>
                        <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Completed" width="18" height="18">
                    `;
                }
                
                // Update progress tracker
                updateProgressTracker('regulatory-documents');
                
                console.log('Regulatory documents task marked as completed');
            } else {
                console.log('Not all regulatory documents are completed yet');
            }
        } else {
            console.log('Regulatory documents task not found');
        }
    }
    
    // Function to mark task as complete
    function markTaskAsComplete(taskType) {
        const taskCard = document.querySelector(`[data-task="${taskType}"]`);
        if (taskCard) {
            taskCard.classList.remove('pending');
            taskCard.classList.add('completed');
            
            const statusElement = taskCard.querySelector('.task-status');
            if (statusElement) {
                statusElement.classList.remove('pending');
                statusElement.classList.add('completed');
                statusElement.innerHTML = `
                    <span>Completed</span>
                    <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Completed" width="18" height="18">
                `;
            }
            
            // Update progress tracker
            updateProgressTracker(taskType);
            
            console.log(`Task ${taskType} marked as complete`);
        }
    }
    

    
    // Function to initialize progress tracker
    function initializeProgressTracker() {
        const sections = ['budget', 'doc-collection', 'site-initiation', 'supplies-training', 'site-activation'];
        
        sections.forEach(section => {
            const progressItem = document.querySelector(`[data-section="${section}"]`);
            if (progressItem) {
                // Count completed tasks in this section (only task cards, not progress items)
                const completedTasks = document.querySelectorAll(`.task-card[data-section="${section}"].completed`);
                const totalTasks = document.querySelectorAll(`.task-card[data-section="${section}"]`);
                
                const completedCount = completedTasks.length;
                const totalCount = totalTasks.length;
                
                // Update the progress badge
                const progressBadge = progressItem.querySelector('.progress-badge span');
                if (progressBadge) {
                    progressBadge.textContent = `${completedCount}/${totalCount}`;
                }
                
                // Update progress bar and badge styling
                const progressBar = progressItem.querySelector('.progress-bar');
                const badge = progressItem.querySelector('.progress-badge');
                
                if (completedCount === totalCount && completedCount > 0) {
                    // All tasks completed - make it active/blue
                    progressItem.classList.add('active');
                    progressBar.classList.add('active');
                    badge.classList.add('active');
                } else {
                    // Not all tasks completed - keep it gray
                    progressItem.classList.remove('active');
                    progressBar.classList.remove('active');
                    badge.classList.remove('active');
                }
            }
        });
    }
    
    // Function to handle budget acceptance
    function handleBudgetAcceptance() {
        // Add checkmark to the document status
        const documentStatus = document.querySelector('.document-status');
        if (documentStatus) {
            documentStatus.innerHTML = `
                <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Approved" width="24" height="24">
            `;
        }
        
        // Update approve button
        if (acceptBudgetButton) {
            acceptBudgetButton.disabled = true;
            acceptBudgetButton.textContent = 'Approved';
        }
        
        // Mark task as complete
        markTaskAsComplete('budget-cta');
        
        console.log('Budget & CTA approved and task marked as complete');
    }
    
    // Function to handle budget rejection
    function handleBudgetRejection() {
        // Update approve button
        if (acceptBudgetButton) {
            acceptBudgetButton.disabled = true;
            acceptBudgetButton.textContent = 'Rejected';
        }
        
        console.log('Budget & CTA rejected');
    }
    
    // Function to add a new comment
    function addComment(commentText) {
        if (!commentText.trim()) return;
        
        const currentTime = new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        const newCommentHTML = `
            <div class="activity-item">
                <div class="activity-avatar">HW</div>
                <div class="activity-content">
                    <div class="activity-header">
                        <span class="activity-user">Herbert Wright</span>
                        <span class="activity-action">added a comment</span>
                        <span class="activity-time">${currentTime}</span>
                    </div>
                    <div class="activity-text">
                        ${commentText}
                    </div>
                </div>
            </div>
        `;
        
        // Add the new comment at the top of the activity feed
        if (activityFeed) {
            activityFeed.insertAdjacentHTML('afterbegin', newCommentHTML);
        }
        
        console.log('Comment added:', commentText);
    }
    
    // Function to clear comment textarea
    function clearCommentTextarea() {
        if (commentTextarea) {
            commentTextarea.value = '';
            updateSendButtonState(); // Update button state after clearing
        }
    }
    
    // Function to handle sending a comment
    function handleSendComment() {
        if (commentTextarea && commentTextarea.value.trim()) {
            addComment(commentTextarea.value.trim());
            clearCommentTextarea();
        }
    }
    
    // Function to handle canceling a comment
    function handleCancelComment() {
        clearCommentTextarea();
    }
    

    
    // Function to update send button state based on textarea content
    function updateSendButtonState() {
        if (sendCommentButton && commentTextarea) {
            const hasText = commentTextarea.value.trim().length > 0;
            if (hasText) {
                sendCommentButton.classList.add('active');
            } else {
                sendCommentButton.classList.remove('active');
            }
        }
    }
    
    // Function to set view mode (disabled)
    function setViewMode() {
        sidesheetContainer.classList.remove('edit-mode');
        editButton.classList.remove('save-mode');
        editButton.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.5 1.5L12.5 2.5L4.5 10.5H3.5V9.5L11.5 1.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Edit</span>
        `;
        
        // Disable all form inputs
        formInputs.forEach(input => {
            input.disabled = true;
        });
        
        // Disable all yes/no buttons
        yesNoButtons.forEach(button => {
            button.disabled = true;
        });
        
        console.log('Switched to view mode');
    }
    
    // Function to set edit mode (enabled)
    function setEditMode() {
        sidesheetContainer.classList.add('edit-mode');
        editButton.classList.add('save-mode');
        editButton.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 9L9 5M9 5L7 3M9 5L11 7M3 11H7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Save</span>
        `;
        
        // Enable all form inputs
        formInputs.forEach(input => {
            input.disabled = false;
        });
        
        // Enable all yes/no buttons
        yesNoButtons.forEach(button => {
            button.disabled = false;
        });
        
        console.log('Switched to edit mode');
    }
    
    // Function to toggle edit mode
    function toggleEditMode() {
        if (sidesheetContainer.classList.contains('edit-mode')) {
            // Currently in edit mode, save and switch to view mode
            setViewMode();
            console.log('Saved changes and switched to view mode');
        } else {
            // Currently in view mode, switch to edit mode
            setEditMode();
        }
    }
    
    // Progress tracker click events
    progressItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                filterSection(sectionId);
            }
        });
    });
    
    // Task card click events
    taskCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Check if task is completed or pending
            const isCompleted = this.classList.contains('completed');
            const taskType = this.getAttribute('data-task');
            
            console.log('Task clicked:', this.querySelector('.task-title').textContent, 'Status:', isCompleted ? 'Completed' : 'Pending', 'Task Type:', taskType);
            
            // Open sidesheet for specific tasks
            console.log('Task card clicked with taskType:', taskType);
            if (taskType === 'feasibility') {
                openSidesheet('feasibility');
            } else if (taskType === 'budget-cta') {
                openSidesheet('budget-cta');
            } else if (taskType === 'point-of-contacts') {
                openSidesheet('point-of-contacts');
            } else if (taskType === 'regulatory-documents') {
                openSidesheet('regulatory-documents');
            } else if (taskType === 'site-qualification-visit') {
                openSQVOverlay();
            } else if (taskType === 'investigator-meeting') {
                openIMSidesheet();
            } else if (taskType === 'site-initiation-visit') {
                openSIVSidesheet();
            } else if (taskType === 'confirm-supplies') {
                openSuppliesSidesheet();
            } else if (taskType === 'confirm-portal-training') {
                openPortalTrainingSidesheet();
            } else if (taskType === 'site-activation-letter') {
                openSiteActivationSidesheet();
            }
        });
    });




    
    // Edit button click event
    if (editButton) {
        editButton.addEventListener('click', toggleEditMode);
    }
    

    
    // Point of Contacts edit button event listener
    const contactsEditBtn = document.getElementById('edit-contacts-btn');
    if (contactsEditBtn) {
        contactsEditBtn.addEventListener('click', function() {
            const isEditing = this.textContent.trim() === 'Save';
            
            if (isEditing) {
                // Save mode - switch back to view mode
                setContactsViewMode();
            } else {
                // Edit mode - switch to edit mode
                setContactsEditMode();
            }
        });
        console.log('Point of Contacts edit button event listener set up');
    } else {
        console.log('Point of Contacts edit button not found');
    }

    // Function to set appropriate placeholder text based on field type
    function setFieldPlaceholder(input) {
        const fieldId = input.id;
        let placeholder = '';
        
        if (fieldId.includes('name')) {
            placeholder = 'Add name';
        } else if (fieldId.includes('phone')) {
            placeholder = 'Add phone';
        } else if (fieldId.includes('email')) {
            placeholder = 'Add email';
        } else if (fieldId.includes('address')) {
            placeholder = 'Add address';
        } else {
            placeholder = 'Add value';
        }
        
        input.placeholder = placeholder;
    }

    // Add click event listeners to "Add" fields to automatically switch to edit mode
    function setupAddFieldListeners() {
        const addFields = document.querySelectorAll('#contacts-view-mode .contact-input, #contacts-view-mode .contact-textarea');
        
        addFields.forEach(field => {
            field.addEventListener('click', function() {
                // Check if we're currently in view mode
                const editBtn = document.getElementById('edit-contacts-btn');
                if (editBtn && editBtn.textContent.trim() === 'Edit') {
                    // Switch to edit mode first
                    setContactsEditMode();
                    
                    // Focus on the clicked field
                    setTimeout(() => {
                        this.focus();
                    }, 100);
                }
            });
        });
    }

    // Point of Contacts close button event listener
    const contactsCloseBtn = document.getElementById('close-contacts-btn');
    if (contactsCloseBtn) {
        contactsCloseBtn.addEventListener('click', closePointOfContactsSidesheet);
        console.log('Point of Contacts close button event listener set up');
    } else {
        console.log('Point of Contacts close button not found');
    }
    
    // Budget sidesheet event listeners
    if (closeBudgetSidesheet) {
        closeBudgetSidesheet.addEventListener('click', closeBudgetSidesheetFunc);
    }
    
    if (acceptBudgetButton) {
        acceptBudgetButton.addEventListener('click', handleBudgetAcceptance);
    }
    
    // Regulatory documents sidesheet event listeners
    const closeRegulatoryDocumentsSidesheetBtn = document.getElementById('close-regulatory-documents-sidesheet');
    console.log('Found regulatory documents close button:', closeRegulatoryDocumentsSidesheetBtn);
    if (closeRegulatoryDocumentsSidesheetBtn) {
        closeRegulatoryDocumentsSidesheetBtn.addEventListener('click', closeRegulatoryDocumentsSidesheet);
        console.log('Added click event listener to regulatory documents close button');
    } else {
        console.log('ERROR: Could not find regulatory documents close button!');
    }
    

    
    // Comment system event listeners
    if (sendCommentButton) {
        sendCommentButton.addEventListener('click', handleSendComment);
    }
    
    if (cancelCommentButton) {
        cancelCommentButton.addEventListener('click', handleCancelComment);
    }
    

    
    // Handle Enter key in comment textarea
    if (commentTextarea) {
        commentTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
            }
        });
        
        // Monitor textarea input to update send button state
        commentTextarea.addEventListener('input', updateSendButtonState);
        commentTextarea.addEventListener('paste', updateSendButtonState);
        commentTextarea.addEventListener('cut', updateSendButtonState);
    }
    

    
    // Close budget sidesheet when clicking overlay
    if (budgetSidesheetOverlay) {
        budgetSidesheetOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBudgetSidesheetFunc();
            }
        });
    }

    // Close Point of Contacts sidesheet when clicking overlay
    const pointOfContactsSidesheetOverlay = document.getElementById('point-of-contacts-sidesheet-overlay');
    if (pointOfContactsSidesheetOverlay) {
        pointOfContactsSidesheetOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closePointOfContactsSidesheet();
            }
        });
    }

    // Close Regulatory Documents sidesheet when clicking overlay
    const regulatoryDocumentsSidesheetOverlay = document.getElementById('regulatory-documents-sidesheet-overlay');
    if (regulatoryDocumentsSidesheetOverlay) {
        regulatoryDocumentsSidesheetOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeRegulatoryDocumentsSidesheet();
            }
        });
    }

    // Form 1572 Document Item Click Handler
    const form1572Item = document.getElementById('form-1572-item');
    if (form1572Item) {
        form1572Item.addEventListener('click', function() {
            console.log('Form 1572 item clicked');
            openForm1572Sidesheet();
        });
    }

    // Close Form 1572 sidesheet button
    const closeForm1572SidesheetBtn = document.getElementById('close-form-1572-sidesheet');
    if (closeForm1572SidesheetBtn) {
        console.log('Found Form 1572 close button:', closeForm1572SidesheetBtn);
        closeForm1572SidesheetBtn.addEventListener('click', function() {
            console.log('Form 1572 close button clicked');
            closeForm1572Sidesheet();
        });
        console.log('Added click event listener to Form 1572 close button');
    } else {
        console.log('ERROR: Could not find Form 1572 close button!');
    }

    // Close Form 1572 sidesheet when clicking overlay
    const form1572Overlay = document.getElementById('form-1572-sidesheet-overlay');
    if (form1572Overlay) {
        form1572Overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeForm1572Sidesheet();
            }
        });
    }

    // Form 1572 Submit Signature Button
    const submitSignatureBtn = document.getElementById('submit-signature-btn');
    if (submitSignatureBtn) {
        submitSignatureBtn.addEventListener('click', function() {
            console.log('Submit signature button clicked');
            handleSignatureSubmission();
        });
    }

    
    // Close sidesheet events
    if (closeSidesheet) {
        closeSidesheet.addEventListener('click', closeSidesheetFunc);
    }
    
    // Close sidesheet when clicking overlay
    if (sidesheetOverlay) {
        sidesheetOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSidesheetFunc();
            }
        });
    }
    
    // Yes/No button click events
    yesNoButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!sidesheetContainer.classList.contains('edit-mode')) {
                return; // Only allow clicking in edit mode
            }
            
            // Remove active class from sibling buttons
            const buttonGroup = this.closest('.button-group');
            const siblings = buttonGroup.querySelectorAll('.yes-no-button');
            siblings.forEach(sib => sib.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            console.log('Selected:', this.textContent);
        });
    });
    
    // Close sidesheet with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (sidesheetOverlay.classList.contains('active')) {
                closeSidesheetFunc();
            } else if (budgetSidesheetOverlay.classList.contains('active')) {
                closeBudgetSidesheetFunc();
            } else if (document.getElementById('point-of-contacts-sidesheet-overlay').classList.contains('active')) {
                closePointOfContactsSidesheet();
            } else if (document.getElementById('regulatory-documents-sidesheet-overlay').classList.contains('active')) {
                closeRegulatoryDocumentsSidesheet();
                    } else if (document.getElementById('form-1572-sidesheet-overlay').classList.contains('active')) {
            closeForm1572Sidesheet();
        } else if (document.getElementById('supplies-sidesheet').classList.contains('active')) {
            closeSuppliesSidesheet();
        } else if (document.getElementById('portal-training-sidesheet').classList.contains('active')) {
            closePortalTrainingSidesheet();
        } else if (document.getElementById('site-activation-sidesheet').classList.contains('active')) {
            closeSiteActivationSidesheet();
        }
        }
    });
    
    // Initialize progress tracker with correct counts
    initializeProgressTracker();
    
    // Initialize with Budget & CTA section active
    filterSection('budget');
    
    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            // Update toggle icon
            const toggleIcon = this.querySelector('svg');
            if (sidebar.classList.contains('collapsed')) {
                toggleIcon.innerHTML = '<path d="M6 6L18 18M6 18L18 6" stroke="#343A40" stroke-width="2" stroke-linecap="round"/>';
            } else {
                toggleIcon.innerHTML = '<path d="M18 6L6 18M6 6L18 18" stroke="#343A40" stroke-width="2" stroke-linecap="round"/>';
            }
        });
    }

    // Navigation item interactions
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // You can add navigation logic here
            console.log('Navigation item clicked:', this);
        });
    });

    // Select dropdown functionality
    const selectDropdown = document.querySelector('.select-dropdown');
    
    if (selectDropdown) {
        selectDropdown.addEventListener('click', function() {
            // Toggle dropdown state
            this.classList.toggle('open');
            
            // You can add dropdown menu logic here
            console.log('Clinic selector clicked');
        });
    }

    // Search functionality
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            // You can add search modal or functionality here
            console.log('Search clicked');
        });
    }

    // Action items functionality
    const actionItems = document.querySelector('.action-items');
    
    if (actionItems) {
        actionItems.addEventListener('click', function() {
            // You can add action items panel logic here
            console.log('Action items clicked');
        });
    }

    // Avatar functionality
    const avatar = document.querySelector('.avatar');
    
    if (avatar) {
        avatar.addEventListener('click', function() {
            // You can add user menu logic here
            console.log('Avatar clicked');
        });
    }

    // Breadcrumb interactions
    const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
    
    breadcrumbItems.forEach(item => {
        item.addEventListener('click', function() {
            // You can add breadcrumb navigation logic here
            console.log('Breadcrumb clicked:', this.textContent);
        });
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchIcon.click();
        }
        
        // Escape to close dropdowns/modals
        if (e.key === 'Escape') {
            selectDropdown.classList.remove('open');
            
            // Close sidesheets if they're open
            if (sidesheetOverlay.classList.contains('active')) {
                closeSidesheetFunc();
            } else if (budgetSidesheetOverlay.classList.contains('active')) {
                closeBudgetSidesheetFunc();
            } else if (document.getElementById('point-of-contacts-sidesheet-overlay').classList.contains('active')) {
                closePointOfContactsSidesheet();
            }
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.task-card, .progress-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.nav-item, .task-card, .select-dropdown, .search-icon, .action-items, .progress-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.cursor = 'default';
        });
    });

    // Simulate task completion (for demo purposes)
    function simulateTaskCompletion() {
        const pendingTask = document.querySelector('.task-card.pending');
        if (pendingTask) {
            setTimeout(() => {
                pendingTask.classList.remove('pending');
                pendingTask.classList.add('completed');
                
                const statusElement = pendingTask.querySelector('.task-status');
                statusElement.innerHTML = `
                    <span>Completed</span>
                    <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Completed" width="18" height="18">
                `;
                
                console.log('Task completed!');
            }, 5000); // Simulate completion after 5 seconds
        }
    }

    // Start simulation (comment out for production)
    // simulateTaskCompletion();

    // Point of Contacts Sidesheet Functions
    function openPointOfContactsSidesheet() {
        console.log('=== openPointOfContactsSidesheet called ===');
        const sidesheetOverlay = document.getElementById('point-of-contacts-sidesheet-overlay');
        console.log('Found sidesheet overlay:', sidesheetOverlay);
        console.log('Overlay ID:', sidesheetOverlay ? sidesheetOverlay.id : 'NOT FOUND');
        
        if (sidesheetOverlay) {
            sidesheetOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Added active class to sidesheet overlay');
            console.log('Overlay classes after adding active:', sidesheetOverlay.className);
            
            // Store the current active tab before opening sidesheet
            const currentActiveTab = document.querySelector('.progress-item.active');
            const currentActiveSection = currentActiveTab ? currentActiveTab.getAttribute('data-section') : null;
            
            console.log('Before opening sidesheet - Active tab:', currentActiveSection);
            console.log('Active tab element:', currentActiveTab);
            
            // Don't change the current section at all - preserve whatever tab is currently active
            // The sidesheet should behave as a true overlay that doesn't affect the main content
            
            // Check initial completion status
            setTimeout(() => {
                // Check if the active tab is still active after a delay
                const stillActiveTab = document.querySelector('.progress-item.active');
                const stillActiveSection = stillActiveTab ? stillActiveTab.getAttribute('data-section') : null;
                console.log('After timeout - Active tab:', stillActiveSection);
                
                checkSectionCompletion();
                updateTaskStatusBasedOnData();
                
                // Set up click listeners for "Add" fields
                setupAddFieldListeners();
            }, 100);
            
            console.log('Opened Point of Contacts sidesheet while preserving active tab:', currentActiveSection);
        }
    }

    function updateTaskStatusBasedOnData() {
        // Define required fields (including Sub Investigator)
        const requiredFields = [
            'pi-name', 'pi-phone', 'pi-email',
            'crc-name', 'crc-phone', 'crc-email',
            'lab-address',
            'sub-name', 'sub-phone', 'sub-email',
            'vial-name', 'vial-phone', 'vial-email'
        ];
        
        let allRequiredFieldsFilled = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value.trim() === '') {
                allRequiredFieldsFilled = false;
            }
        });
        
        // Update task status based on data completeness
        if (allRequiredFieldsFilled) {
            markTaskAsComplete('point-of-contacts');
            console.log('Task status updated to complete based on data');
        } else {
            markTaskAsIncomplete('point-of-contacts');
            console.log('Task status updated to pending based on data');
        }
    }

    function closePointOfContactsSidesheet() {
        const sidesheetOverlay = document.getElementById('point-of-contacts-sidesheet-overlay');
        if (sidesheetOverlay) {
            sidesheetOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Don't change the current section state - preserve whatever tab was active
            // The sidesheet should behave as a true overlay
            
            // Update task status based on current data when closing
            updateTaskStatusBasedOnData();
            
            console.log('Closed Point of Contacts sidesheet');
        }
    }



    function setContactsViewMode() {
        const editBtn = document.getElementById('edit-contacts-btn');
        const inputs = document.querySelectorAll('#contacts-view-mode .contact-input, #contacts-view-mode .contact-textarea');
        
        // Make all inputs readonly
        inputs.forEach(input => {
            input.readOnly = true;
            // Keep placeholders in view mode for empty fields
            if (input.value.trim() === '') {
                setFieldPlaceholder(input);
            }
        });
        
        // Change button back to "Edit"
        editBtn.innerHTML = `
            <img src="./assets/84fc22550c76ed3fe247f7c054db1fd65c249ed9.svg" alt="Edit" width="14" height="14">
            Edit
        `;
        
        // Check completion status when switching to view mode
        checkSectionCompletion();
        
        // Check if all required fields are filled and mark task as complete
        checkAndMarkTaskComplete();
        
        console.log('Switched to view mode');
    }

    function checkAndMarkTaskComplete() {
        // Define required fields (including Sub Investigator)
        const requiredFields = [
            'pi-name', 'pi-phone', 'pi-email',
            'crc-name', 'crc-phone', 'crc-email',
            'lab-address',
            'sub-name', 'sub-phone', 'sub-email',
            'vial-name', 'vial-phone', 'vial-email'
        ];
        
        let allRequiredFieldsFilled = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value.trim() === '') {
                allRequiredFieldsFilled = false;
            }
        });
        
        // Get the Point of Contacts task card
        const pointOfContactsTask = document.querySelector('[data-task="point-of-contacts"]');
        if (!pointOfContactsTask) return;
        
        // If all required fields are filled, mark the task as complete
        if (allRequiredFieldsFilled) {
            markTaskAsComplete('point-of-contacts');
            console.log('Point of Contacts task marked as complete!');
        } else {
            // If any required field is empty, mark the task as incomplete
            markTaskAsIncomplete('point-of-contacts');
            console.log('Point of Contacts task marked as incomplete!');
        }
    }

    function markTaskAsIncomplete(taskType) {
        const taskCard = document.querySelector(`[data-task="${taskType}"]`);
        if (!taskCard) return;
        
        // Remove completed class and add pending class
        taskCard.classList.remove('completed');
        taskCard.classList.add('pending');
        
        // Update the task status to show due date with clock icon
        const taskStatus = taskCard.querySelector('.task-status');
        if (taskStatus) {
            // Remove completed class and add pending class to the status element
            taskStatus.classList.remove('completed');
            taskStatus.classList.add('pending');
            
            taskStatus.innerHTML = `
                <img src="./assets/e6da9f1fa973f15a78e1475d3fc3f7a2708c1579.svg" alt="Clock" width="16" height="16">
                <span>Due Sep 30, 2025</span>
            `;
        }
        
        // Update progress tracker
        updateProgressTracker(taskType);
        
        console.log(`${taskType} task marked as incomplete`);
    }

    function setContactsEditMode() {
        const editBtn = document.getElementById('edit-contacts-btn');
        const inputs = document.querySelectorAll('#contacts-view-mode .contact-input, #contacts-view-mode .contact-textarea');
        
        // Make all inputs editable
        inputs.forEach(input => {
            input.readOnly = false;
            // Set appropriate placeholder based on field type
            setFieldPlaceholder(input);
        });
        
        // Change button to "Save"
        editBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Save
        `;
        
        // Add event listeners to inputs to check completion status and handle placeholders
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                checkSectionCompletion();
                // Update placeholder when value is cleared
                if (this.value.trim() === '') {
                    setFieldPlaceholder(this);
                }
            });
        });
        
        console.log('Switched to edit mode');
    }

    function checkSectionCompletion() {
        // Check each section for completion
        checkSection('pi', ['pi-name', 'pi-phone', 'pi-email']);
        checkSection('crc', ['crc-name', 'crc-phone', 'crc-email']);
        checkSection('lab', ['lab-address']);
        checkSection('sub', ['sub-name', 'sub-phone', 'sub-email']); // Optional section
        checkSection('vial', ['vial-name', 'vial-phone', 'vial-email']);
        
        // Also check overall task completion status
        checkAndMarkTaskComplete();
    }

    function checkSection(sectionType, fieldIds) {
        const sectionHeader = document.querySelector(`.contact-section:has(#${fieldIds[0]}) .section-header img, .contact-section:has(#${fieldIds[0]}) .section-header svg`);
        if (!sectionHeader) return;
        
        let allFieldsFilled = true;
        let hasAnyData = false;
        
        fieldIds.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                const value = field.value.trim();
                if (value !== '') {
                    hasAnyData = true;
                } else {
                    allFieldsFilled = false;
                }
            }
        });
        
        // Update icon based on completion status
        if (allFieldsFilled) {
            sectionHeader.outerHTML = `<img src="./assets/78ada98ada7eeee46eabb24f671e18ec7375a7d1.svg" alt="Check" width="20" height="20">`;
        } else {
            // Create red X icon inline
            sectionHeader.outerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="#dc3545" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        }
    }



    // Add some interactive console messages
    console.log('🏥 Clinical Trial Site Onboarding loaded successfully!');
    console.log('💡 Try clicking the progress tracker tabs to filter sections!');
    console.log('💡 Click on "Feasibility Questionnaire" to open the sidesheet!');
    console.log('💡 Click on "Budget & CTA" to review and accept the budget!');
    console.log('💡 Click on "Point of Contacts" to fill out contact information!');

    console.log('💡 Click "Edit" to make the form editable!');
    console.log('💡 Click "Accept & Sign" to complete the budget task!');
    console.log('⌨️  Use Ctrl/Cmd + K to open search');
    console.log('⌨️  Use number keys 1-5 for quick section filtering');
    console.log('⌨️  Use Escape to close the sidesheet');
    console.log('📋 All sections are now filterable by clicking the progress tabs!');
    
    // Check initial Point of Contacts task status based on current data
    setTimeout(() => {
        updateTaskStatusBasedOnData();
    }, 500);
});

/* ==========================================================================
   Progress Tracker Functions
   ========================================================================== */

/**
 * Function to update progress tracker
 */
function updateProgressTracker(taskType) {
    console.log(`updateProgressTracker called with taskType: ${taskType}`);
    
    const taskCard = document.querySelector(`[data-task="${taskType}"]`);
    if (!taskCard) {
        console.error(`Task card not found for taskType: ${taskType}`);
        return;
    }
    
    const section = taskCard.getAttribute('data-section');
    console.log(`Found section: ${section}`);
    
    const progressItem = document.querySelector(`[data-section="${section}"]`);
    if (!progressItem) {
        console.error(`Progress item not found for section: ${section}`);
        return;
    }
    
    // Count completed tasks in this section (only task cards, not progress items)
    const completedTasks = document.querySelectorAll(`.task-card[data-section="${section}"].completed`);
    const totalTasks = document.querySelectorAll(`.task-card[data-section="${section}"]`);
    
    const completedCount = completedTasks.length;
    const totalCount = totalTasks.length;
    
    console.log(`Progress Update - Section: ${section}, Completed: ${completedCount}/${totalCount}, Task: ${taskType}`);
    console.log(`Found ${completedTasks.length} completed tasks and ${totalTasks.length} total tasks`);
    
    // Update the progress badge
    const progressBadge = progressItem.querySelector('.progress-badge span');
    if (progressBadge) {
        const oldText = progressBadge.textContent;
        progressBadge.textContent = `${completedCount}/${totalCount}`;
        console.log(`Updated progress badge from "${oldText}" to "${completedCount}/${totalCount}"`);
    } else {
        console.error(`Progress badge span not found in section: ${section}`);
    }
    
    // Update progress bar and badge styling (but don't change the active state for user-selected tabs)
    const progressBar = progressItem.querySelector('.progress-bar');
    const badge = progressItem.querySelector('.progress-badge');
    
    if (completedCount === totalCount && completedCount > 0) {
        // All tasks completed - make it active/blue
        progressItem.classList.add('active');
        progressBar.classList.add('active');
        badge.classList.add('active');
        console.log(`All tasks completed for section: ${section} - Progress bar turned blue`);
    } else {
        // Not all tasks completed - only remove active if it's not user-selected
        // Don't remove active class if this tab was manually selected by the user
        // The active class will only be removed by filterSection() when user clicks a different tab
        console.log(`Not all tasks completed for section: ${section} - Progress bar remains gray`);
    }
}

/* ==========================================================================
   Site Qualification Visit Sidesheet Functions
   ========================================================================== */

/**
 * Opens the Site Qualification Visit sidesheet
 */
function openSQVOverlay() {
    console.log('openSQVOverlay function called');
    const sqvSidesheet = document.getElementById('sqv-overlay');
    if (sqvSidesheet) {
        sqvSidesheet.classList.add('active');
        console.log('Added active class to sidesheet');
        console.log('sqvSidesheet element:', sqvSidesheet);
    } else {
        console.error('sqvSidesheet element not found');
    }
}

/**
 * Closes the Site Qualification Visit sidesheet
 */
function closeSQVOverlay() {
    const sqvSidesheet = document.getElementById('sqv-overlay');
    if (sqvSidesheet) {
        sqvSidesheet.classList.remove('active');
    }
}

/**
 * Completes all SQV tasks and marks the SQV task card as complete
 */
function completeSQV() {
    console.log('completeSQV function called');
    
    // Update the SQV Completed step icon to completed
    const sqvCompletedStep = document.querySelector('.sqv-overlay .timeline-step:nth-child(3) .step-icon');
    if (sqvCompletedStep) {
        sqvCompletedStep.classList.remove('pending');
        sqvCompletedStep.classList.add('completed');
        sqvCompletedStep.innerHTML = '<img src="./assets/bc64d3813d46a4c401f1483207e7f0e8e21ac561.svg" alt="Completed" width="22" height="22">';
        console.log('Updated SQV Completed step icon to completed');
    }
    
    // Update the Site Selection Letter step icon to completed
    const siteSelectionStep = document.querySelector('.sqv-overlay .timeline-step:nth-child(4) .step-icon');
    if (siteSelectionStep) {
        siteSelectionStep.classList.remove('pending');
        siteSelectionStep.classList.add('completed');
        siteSelectionStep.innerHTML = '<img src="./assets/bc64d3813d46a4c401f1483207e7f0e8e21ac561.svg" alt="Completed" width="22" height="22">';
        console.log('Updated Site Selection Letter step icon to completed');
    }
    
    // Update all due date badges in the SQV modal to show completed status
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Update SQV Completed due date badge
    const sqvDueBadge = document.getElementById('sqv-due-badge');
    if (sqvDueBadge) {
        sqvDueBadge.innerHTML = `
            <span>Completed: ${currentDate}</span>
        `;
        sqvDueBadge.classList.remove('due');
        sqvDueBadge.classList.add('completed');
        console.log('Updated SQV Completed due date badge to show completed status');
    }
    
    // Update Site Selection Letter due date badge
    const siteSelectionDueBadge = document.getElementById('site-selection-due-badge');
    if (siteSelectionDueBadge) {
        siteSelectionDueBadge.innerHTML = `
            <span>Completed: ${currentDate}</span>
        `;
        siteSelectionDueBadge.classList.remove('due');
        siteSelectionDueBadge.classList.add('completed');
        console.log('Updated Site Selection Letter due date badge to show completed status');
    }
    
    // Update the complete button to show completed state
    const completeBtn = document.querySelector('.sqv-complete-btn');
    if (completeBtn) {
        completeBtn.innerHTML = `
            <img src="./assets/check.svg" alt="Check" width="16" height="16">
            <span>SQV Completed</span>
        `;
        completeBtn.disabled = true;
        console.log('Updated complete button to completed state');
    }
    
    // Mark the SQV task card as complete
    const sqvTaskCard = document.querySelector('[data-task="site-qualification-visit"]');
    if (sqvTaskCard) {
        sqvTaskCard.classList.remove('pending');
        sqvTaskCard.classList.add('completed');
        
        const statusElement = sqvTaskCard.querySelector('.task-status');
        if (statusElement) {
            statusElement.classList.remove('pending');
            statusElement.classList.add('completed');
            statusElement.innerHTML = `
                <span>Completed</span>
                <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Completed" width="18" height="18">
            `;
        }
        
        // Update progress tracker
        updateProgressTracker('site-qualification-visit');
        
        console.log('SQV task card marked as complete');
        console.log('Calling updateProgressTracker for site-qualification-visit');
    }
    

}

/**
 * Completes all IM tasks and marks the IM task card as complete
 */
function completeIM() {
    console.log('completeIM function called');
    
    // Update the Schedule Investigator Meeting step icon to completed
    const scheduleStep = document.querySelector('.im-sidesheet .timeline-step-2:nth-child(1) .step-icon');
    if (scheduleStep) {
        scheduleStep.classList.remove('step-icon--pending');
        scheduleStep.classList.add('completed');
        scheduleStep.innerHTML = '<img src="./assets/bc64d3813d46a4c401f1483207e7f0e8e21ac561.svg" alt="Completed" width="22" height="22">';
        console.log('Updated Schedule Investigator Meeting step icon to completed');
    }
    
    // Update the Attend Investigator Meeting step icon to completed
    const attendStep = document.querySelector('.im-sidesheet .timeline-step-2:nth-child(2) .step-icon');
    if (attendStep) {
        attendStep.classList.remove('step-icon--pending');
        attendStep.classList.add('completed');
        attendStep.innerHTML = '<img src="./assets/bc64d3813d46a4c401f1483207e7f0e8e21ac561.svg" alt="Completed" width="22" height="22">';
        console.log('Updated Attend Investigator Meeting step icon to completed');
    }
    
    // Update all due date badges in the IM modal to show completed status
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Update Schedule Investigator Meeting due date badge
    const scheduleDueBadge = document.getElementById('im-schedule-due-badge');
    if (scheduleDueBadge) {
        scheduleDueBadge.innerHTML = `
            <span>Completed: ${currentDate}</span>
        `;
        scheduleDueBadge.classList.remove('detail-badge--due');
        scheduleDueBadge.classList.add('completed');
        console.log('Updated Schedule Investigator Meeting due date badge to show completed status');
    }
    
    // Update Attend Investigator Meeting due date badge
    const attendDueBadge = document.getElementById('im-attend-due-badge');
    if (attendDueBadge) {
        attendDueBadge.innerHTML = `
            <span>Completed: ${currentDate}</span>
        `;
        attendDueBadge.classList.remove('detail-badge--due');
        attendDueBadge.classList.add('completed');
        console.log('Updated Attend Investigator Meeting due date badge to show completed status');
    }
    
    // Update the complete button to show completed state
    const completeBtn = document.querySelector('.im-complete-btn');
    if (completeBtn) {
        completeBtn.innerHTML = `
            <img src="./assets/check.svg" alt="Check" width="16" height="16">
            <span>IM Completed</span>
        `;
        completeBtn.disabled = true;
        console.log('Updated complete button to completed state');
    }
    
    // Mark the IM task card as complete
    const imTaskCard = document.querySelector('[data-task="investigator-meeting"]');
    if (imTaskCard) {
        imTaskCard.classList.remove('pending');
        imTaskCard.classList.add('completed');
        
        const statusElement = imTaskCard.querySelector('.task-status');
        if (statusElement) {
            statusElement.classList.remove('pending');
            statusElement.classList.add('completed');
            statusElement.innerHTML = `
                <span>Completed</span>
                <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Completed" width="18" height="18">
            `;
        }
        
        // Update progress tracker
        updateProgressTracker('investigator-meeting');
        
        console.log('IM task card marked as complete');
        console.log('Calling updateProgressTracker for investigator-meeting');
    }
}

/**
 * Completes individual SIV steps
 */
function completeSIVStep(stepType) {
    console.log(`completeSIVStep function called for: ${stepType}`);
    
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Map step types to their corresponding elements
    const stepMap = {
        'siv-visit': {
            stepIndex: 1,
            badgeId: 'siv-visit-due-badge',
            stepTitle: 'Site Initiation Visit (SIV)'
        },
        'siv-material': {
            stepIndex: 2,
            badgeId: 'siv-material-due-badge',
            stepTitle: 'Material Review'
        },
        'siv-attend': {
            stepIndex: 3,
            badgeId: 'siv-attend-due-badge',
            stepTitle: 'Attend SIV'
        },
        'siv-training': {
            stepIndex: 4,
            badgeId: 'siv-training-due-badge',
            stepTitle: 'SIV Training Collected'
        }
    };
    
    const stepInfo = stepMap[stepType];
    if (!stepInfo) {
        console.error(`Unknown step type: ${stepType}`);
        return;
    }
    
    // Update the step icon to completed
    const stepIcon = document.querySelector(`.siv-sidesheet .timeline-step:nth-child(${stepInfo.stepIndex}) .step-icon`);
    if (stepIcon) {
        stepIcon.classList.remove('step-icon--pending');
        stepIcon.classList.add('completed');
        stepIcon.innerHTML = '<img src="./assets/bc64d3813d46a4c401f1483207e7f0e8e21ac561.svg" alt="Completed" width="22" height="22">';
        console.log(`Updated ${stepInfo.stepTitle} step icon to completed`);
    }
    
    // Update the due date badge to show completed status
    const dueBadge = document.getElementById(stepInfo.badgeId);
    if (dueBadge) {
        dueBadge.innerHTML = `
            <span>Completed: ${currentDate}</span>
        `;
        dueBadge.classList.remove('detail-badge--due');
        dueBadge.classList.add('completed');
        console.log(`Updated ${stepInfo.stepTitle} due date badge to show completed status`);
    }
    
    // Update the complete button to show completed state
    const completeBtn = document.querySelector(`.siv-sidesheet .timeline-step:nth-child(${stepInfo.stepIndex}) .siv-complete-btn`);
    if (completeBtn) {
        completeBtn.innerHTML = `
            <img src="./assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg" alt="Check" width="16" height="16">
            <span>Completed</span>
        `;
        completeBtn.disabled = true;
        console.log(`Updated ${stepInfo.stepTitle} complete button to completed state`);
    }
    
    // Check if all SIV steps are completed
    checkAllSIVStepsCompleted();
}

/**
 * Checks if all SIV steps have been completed
 */
function checkAllSIVStepsCompleted() {
    const completedButtons = document.querySelectorAll('.siv-complete-btn[disabled]');
    const totalButtons = document.querySelectorAll('.siv-complete-btn');
    
    console.log(`Found ${completedButtons.length} completed SIV steps out of ${totalButtons.length} total steps`);
    
    if (completedButtons.length > 0 && completedButtons.length === totalButtons.length) {
        // All SIV steps completed - mark the task as complete
        console.log('All SIV steps completed - marking SIV task as complete');
        markSIVTaskAsComplete();
    } else {
        console.log('Not all SIV steps completed yet');
    }
}

/**
 * Marks the SIV task as complete
 */
function markSIVTaskAsComplete() {
    const sivTaskCard = document.querySelector('[data-task="site-initiation-visit"]');
    if (sivTaskCard) {
        sivTaskCard.classList.remove('pending');
        sivTaskCard.classList.add('completed');
        
        const statusElement = sivTaskCard.querySelector('.task-status');
        if (statusElement) {
            statusElement.classList.remove('pending');
            statusElement.classList.add('completed');
            statusElement.innerHTML = `
                <span>Completed</span>
                <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Completed" width="18" height="18">
            `;
        }
        
        // Update progress tracker
        updateProgressTracker('site-initiation-visit');
        
        console.log('SIV task card marked as complete');
        console.log('Calling updateProgressTracker for site-initiation-visit');
    }
}

/**
 * Event listener to close sidesheet when clicking outside
 */
document.addEventListener('click', function(event) {
    const sqvSidesheet = document.getElementById('sqv-overlay');
    const sqvContainer = document.querySelector('.sqv-container');
    
    if (sqvSidesheet && sqvSidesheet.classList.contains('active')) {
        // Check if the click target is the overlay background (not the container)
        if (event.target === sqvSidesheet) {
            closeSQVOverlay();
        }
    }
    
    const imSidesheet = document.getElementById('im-sidesheet');
    const imContainer = document.querySelector('.im-sidesheet-container');
    
    if (imSidesheet && imSidesheet.classList.contains('active')) {
        // Check if the click target is the overlay background (not the container)
        if (event.target === imSidesheet) {
            closeIMSidesheet();
        }
    }
    
    const sivSidesheet = document.getElementById('siv-sidesheet');
    const sivContainer = document.querySelector('.siv-sidesheet-container');
    
    if (sivSidesheet && sivSidesheet.classList.contains('active')) {
        // Check if the click target is the overlay background (not the container)
        if (event.target === sivSidesheet) {
            closeSIVSidesheet();
        }
    }
    
    const suppliesSidesheet = document.getElementById('supplies-sidesheet');
    const suppliesContainer = document.querySelector('.supplies-sidesheet-container');
    
    if (suppliesSidesheet && suppliesSidesheet.classList.contains('active')) {
        // Check if the click target is the overlay background (not the container)
        if (event.target === suppliesSidesheet) {
            closeSuppliesSidesheet();
        }
    }
    
    const portalTrainingSidesheet = document.getElementById('portal-training-sidesheet');
    const portalTrainingContainer = document.querySelector('.portal-training-sidesheet-container');
    
    if (portalTrainingSidesheet && portalTrainingSidesheet.classList.contains('active')) {
        // Check if the click target is the overlay background (not the container)
        if (event.target === portalTrainingSidesheet) {
            closePortalTrainingSidesheet();
        }
    }
    
    const siteActivationSidesheet = document.getElementById('site-activation-sidesheet');
    const siteActivationContainer = document.querySelector('.site-activation-sidesheet-container');
    
    if (siteActivationSidesheet && siteActivationSidesheet.classList.contains('active')) {
        // Check if the click target is the overlay background (not the container)
        if (event.target === siteActivationSidesheet) {
            closeSiteActivationSidesheet();
        }
    }
});

/* ==========================================================================
   Investigator Meeting Sidesheet Functions
   ========================================================================== */

/**
 * Opens the Investigator Meeting sidesheet
 */
function openIMSidesheet() {
    console.log('openIMSidesheet function called');
    const imSidesheet = document.getElementById('im-sidesheet');
    if (imSidesheet) {
        imSidesheet.classList.add('active');
        console.log('Added active class to IM sidesheet');
    } else {
        console.error('imSidesheet element not found');
    }
}

/**
 * Closes the Investigator Meeting sidesheet
 */
function closeIMSidesheet() {
    const imSidesheet = document.getElementById('im-sidesheet');
    if (imSidesheet) {
        imSidesheet.classList.remove('active');
    }
}

/* ==========================================================================
   Site Initiation Visit (SIV) Sidesheet Functions
   ========================================================================== */

/**
 * Opens the Site Initiation Visit (SIV) sidesheet
 */
function openSIVSidesheet() {
    console.log('openSIVSidesheet function called');
    const sivSidesheet = document.getElementById('siv-sidesheet');
    if (sivSidesheet) {
        sivSidesheet.classList.add('active');
        console.log('Added active class to SIV sidesheet');
    } else {
        console.error('sivSidesheet element not found');
    }
}

/**
 * Closes the Site Initiation Visit (SIV) sidesheet
 */
function closeSIVSidesheet() {
    const sivSidesheet = document.getElementById('siv-sidesheet');
    if (sivSidesheet) {
        sivSidesheet.classList.remove('active');
    }
}

/* ==========================================================================
   Confirm Supplies Received Overlay Functions
   ========================================================================== */

/**
 * Opens the Confirm Supplies Received sidesheet
 */
function openSuppliesSidesheet() {
    console.log('openSuppliesSidesheet function called');
    const suppliesSidesheet = document.getElementById('supplies-sidesheet');
    if (suppliesSidesheet) {
        suppliesSidesheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Added active class to supplies sidesheet');
    } else {
        console.error('suppliesSidesheet element not found');
    }
}

/**
 * Closes the Confirm Supplies Received sidesheet
 */
function closeSuppliesSidesheet() {
    const suppliesSidesheet = document.getElementById('supplies-sidesheet');
    if (suppliesSidesheet) {
        suppliesSidesheet.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed supplies sidesheet');
    }
}

/**
 * Handles confirm receipt button clicks
 */
function handleConfirmReceipt(supplyType) {
    console.log(`handleConfirmReceipt called for: ${supplyType}`);
    
    // Find the supply item and update its state
    const supplyItems = document.querySelectorAll('.supply-item');
    console.log(`Found ${supplyItems.length} supply items`);
    
    supplyItems.forEach(item => {
        const header = item.querySelector('.supply-header h3');
        if (header && header.textContent === supplyType) {
            console.log(`Found matching supply item: ${supplyType}`);
            
            // Update the supply header icon to blue
            const headerIcon = item.querySelector('.supply-header img');
            if (headerIcon) {
                headerIcon.style.filter = 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(199deg) brightness(97%) contrast(96%)';
                console.log('Updated header icon to blue');
            }
            
            // Update the button to show confirmed state
            const confirmBtn = item.querySelector('.confirm-receipt-btn');
            if (confirmBtn) {
                confirmBtn.innerHTML = `
                    <img src="./assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg" alt="Check" width="16" height="16">
                    <span>Confirmed</span>
                `;
                confirmBtn.style.background = '#40c057';
                confirmBtn.disabled = true;
                console.log('Updated confirm button to confirmed state');
            }
            
            // Add a subtle animation
            item.style.borderColor = '#40c057';
            item.style.backgroundColor = '#f8fff9';
        }
    });
    
    // Check if all supplies are confirmed
    console.log('Calling checkAllSuppliesConfirmed');
    checkAllSuppliesConfirmed();
}

/**
 * Checks if all supplies have been confirmed
 */
function checkAllSuppliesConfirmed() {
    console.log('checkAllSuppliesConfirmed called');
    const confirmButtons = document.querySelectorAll('.confirm-receipt-btn');
    const confirmedButtons = document.querySelectorAll('.confirm-receipt-btn[disabled]');
    
    console.log(`Found ${confirmButtons.length} total confirm buttons and ${confirmedButtons.length} disabled (confirmed) buttons`);
    
    if (confirmButtons.length > 0 && confirmButtons.length === confirmedButtons.length) {
        // All supplies confirmed - mark the task as complete
        console.log('All supplies confirmed - calling markSuppliesTaskAsComplete');
        markSuppliesTaskAsComplete();
    } else {
        console.log('Not all supplies confirmed yet');
    }
}

/**
 * Marks the supplies task as complete
 */
function markSuppliesTaskAsComplete() {
    const suppliesTask = document.querySelector('[data-task="confirm-supplies"]');
    if (suppliesTask) {
        suppliesTask.classList.remove('pending');
        suppliesTask.classList.add('completed');
        
        const statusElement = suppliesTask.querySelector('.task-status');
        if (statusElement) {
            statusElement.classList.remove('pending');
            statusElement.classList.add('completed');
            statusElement.innerHTML = `
                <span>Completed</span>
                <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Completed" width="18" height="18">
            `;
        }
        
        // Update progress tracker
        updateProgressTracker('confirm-supplies');
        
        console.log('Supplies task marked as complete');
        console.log('Calling updateProgressTracker for confirm-supplies');
    }
}

/* ==========================================================================
   Portal Training/Access Sidesheet Functions
   ========================================================================== */

/**
 * Opens the Portal Training/Access sidesheet
 */
function openPortalTrainingSidesheet() {
    console.log('openPortalTrainingSidesheet function called');
    const portalTrainingSidesheet = document.getElementById('portal-training-sidesheet');
    if (portalTrainingSidesheet) {
        portalTrainingSidesheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Added active class to portal training sidesheet');
    } else {
        console.error('portalTrainingSidesheet element not found');
    }
}

/**
 * Closes the Portal Training/Access sidesheet
 */
function closePortalTrainingSidesheet() {
    const portalTrainingSidesheet = document.getElementById('portal-training-sidesheet');
    if (portalTrainingSidesheet) {
        portalTrainingSidesheet.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed portal training sidesheet');
    }
}

/**
 * Handles confirm training button clicks
 */
function handleConfirmTraining(trainingType) {
    console.log(`Confirming training for: ${trainingType}`);
    
    // Find the training item and update its state
    const trainingItems = document.querySelectorAll('.training-item');
    trainingItems.forEach(item => {
        const header = item.querySelector('.training-header h3');
        if (header && header.textContent === trainingType) {
            // Update the training header icon to blue
            const headerIcon = item.querySelector('.training-header img');
            if (headerIcon) {
                headerIcon.style.filter = 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(199deg) brightness(97%) contrast(96%)';
            }
            
            // Update the button to show confirmed state
            const confirmBtn = item.querySelector('.confirm-training-btn');
            if (confirmBtn) {
                confirmBtn.innerHTML = `
                    <img src="./assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg" alt="Check" width="16" height="16">
                    <span>Confirmed</span>
                `;
                confirmBtn.style.background = '#40c057';
                confirmBtn.disabled = true;
            }
            
            // Add a subtle animation
            item.style.borderColor = '#40c057';
            item.style.backgroundColor = '#f8fff9';
        }
    });
    
    // Check if all training items are confirmed
    checkAllTrainingConfirmed();
}

/**
 * Checks if all training items have been confirmed
 */
function checkAllTrainingConfirmed() {
    console.log('checkAllTrainingConfirmed called');
    const confirmButtons = document.querySelectorAll('.confirm-training-btn');
    const confirmedButtons = document.querySelectorAll('.confirm-training-btn[disabled]');
    
    console.log(`Found ${confirmButtons.length} total training buttons and ${confirmedButtons.length} disabled (confirmed) buttons`);
    
    if (confirmButtons.length > 0 && confirmButtons.length === confirmedButtons.length) {
        // All training items confirmed - mark the task as complete
        console.log('All training items confirmed - calling markPortalTrainingTaskAsComplete');
        markPortalTrainingTaskAsComplete();
    } else {
        console.log('Not all training items confirmed yet');
    }
}

/**
 * Marks the portal training task as complete
 */
function markPortalTrainingTaskAsComplete() {
    const portalTrainingTask = document.querySelector('[data-task="confirm-portal-training"]');
    if (portalTrainingTask) {
        portalTrainingTask.classList.remove('pending');
        portalTrainingTask.classList.add('completed');
        
        const statusElement = portalTrainingTask.querySelector('.task-status');
        if (statusElement) {
            statusElement.classList.remove('pending');
            statusElement.classList.add('completed');
            statusElement.innerHTML = `
                <span>Completed</span>
                <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Completed" width="18" height="18">
            `;
        }
        
        // Update progress tracker
        updateProgressTracker('confirm-portal-training');
        
        console.log('Portal training task marked as complete');
        console.log('Calling updateProgressTracker for confirm-portal-training');
    }
}

/* ==========================================================================
   Site Activation Letter Sidesheet Functions
   ========================================================================== */

/**
 * Opens the Site Activation Letter sidesheet
 */
function openSiteActivationSidesheet() {
    console.log('openSiteActivationSidesheet function called');
    const siteActivationSidesheet = document.getElementById('site-activation-sidesheet');
    if (siteActivationSidesheet) {
        siteActivationSidesheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Added active class to site activation sidesheet');
    } else {
        console.error('siteActivationSidesheet element not found');
    }
}

/**
 * Closes the Site Activation Letter sidesheet
 */
function closeSiteActivationSidesheet() {
    const siteActivationSidesheet = document.getElementById('site-activation-sidesheet');
    if (siteActivationSidesheet) {
        siteActivationSidesheet.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed site activation sidesheet');
    }
}

/**
 * Handles confirm activation button clicks
 */
function handleConfirmActivation(activationType) {
    console.log(`Confirming activation for: ${activationType}`);
    
    // Find the activation item and update its state
    const activationItems = document.querySelectorAll('.activation-item');
    activationItems.forEach(item => {
        const header = item.querySelector('.activation-header h3');
        if (header && header.textContent === activationType) {
            // Update the activation header icon to blue
            const headerIcon = item.querySelector('.activation-header img');
            if (headerIcon) {
                headerIcon.style.filter = 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(199deg) brightness(97%) contrast(96%)';
            }
            
            // Update the button to show confirmed state
            const confirmBtn = item.querySelector('.confirm-activation-btn');
            if (confirmBtn) {
                confirmBtn.innerHTML = `
                    <img src="./assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg" alt="Check" width="16" height="16">
                    <span>Confirmed</span>
                `;
                confirmBtn.style.background = '#40c057';
                confirmBtn.disabled = true;
            }
            
            // Add a subtle animation
            item.style.borderColor = '#40c057';
            item.style.backgroundColor = '#f8fff9';
        }
    });
    
    // Check if all activation items are confirmed
    checkAllActivationConfirmed();
}

/**
 * Checks if all activation items have been confirmed
 */
function checkAllActivationConfirmed() {
    console.log('checkAllActivationConfirmed called');
    const confirmButtons = document.querySelectorAll('.confirm-activation-btn');
    const confirmedButtons = document.querySelectorAll('.confirm-activation-btn[disabled]');
    
    console.log(`Found ${confirmButtons.length} total activation buttons and ${confirmedButtons.length} disabled (confirmed) buttons`);
    
    if (confirmButtons.length > 0 && confirmButtons.length === confirmedButtons.length) {
        // All activation items confirmed - mark the task as complete
        console.log('All activation items confirmed - calling markSiteActivationTaskAsComplete');
        markSiteActivationTaskAsComplete();
    } else {
        console.log('Not all activation items confirmed yet');
    }
}

/**
 * Marks the site activation task as complete
 */
function markSiteActivationTaskAsComplete() {
    const siteActivationTask = document.querySelector('[data-task="site-activation-letter"]');
    if (siteActivationTask) {
        siteActivationTask.classList.remove('pending');
        siteActivationTask.classList.add('completed');
        
        const statusElement = siteActivationTask.querySelector('.task-status');
        if (statusElement) {
            statusElement.classList.remove('pending');
            statusElement.classList.add('completed');
            statusElement.innerHTML = `
                <span>Completed</span>
                <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Completed" width="18" height="18">
            `;
        }
        
        // Update progress tracker
        updateProgressTracker('site-activation-letter');
        
        console.log('Site activation task marked as complete');
        console.log('Calling updateProgressTracker for site-activation-letter');
    }
}
