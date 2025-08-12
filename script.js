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
        
        // Check if we're in list view or tabbed view
        const contentContainer = document.querySelector('.content-container');
        const isListView = contentContainer.classList.contains('list-view');
        
        if (isListView) {
            // In list view, show all tasks but don't change the filtering
            // Only return early if this is a tab click, not when switching from list to tabbed view
            return;
        }
        
        // In tabbed view, apply filtering using inline styles
        taskCards.forEach(card => {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });
        
        // Show only the selected section tasks
        const targetTasks = document.querySelectorAll(`[data-section="${sectionId}"]`);
        targetTasks.forEach(task => {
            if (task.classList.contains('task-card')) {
                task.style.display = 'flex';
                task.style.opacity = '1';
                task.style.transform = 'none';
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
            regulatoryDocumentsOverlay.style.display = 'none';
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
        
        // Close all sidesheets except regulatory documents
        const feasibilityOverlay = document.getElementById('sidesheet-overlay');
        const budgetOverlay = document.getElementById('budget-sidesheet-overlay');
        const pointOfContactsOverlay = document.getElementById('point-of-contacts-sidesheet-overlay');
        const suppliesSidesheet = document.getElementById('supplies-sidesheet');
        const portalTrainingSidesheet = document.getElementById('portal-training-sidesheet');
        const siteActivationSidesheet = document.getElementById('site-activation-sidesheet');
        
        // Close other sidesheets
        if (feasibilityOverlay) feasibilityOverlay.classList.remove('active');
        if (budgetOverlay) budgetOverlay.classList.remove('active');
        if (pointOfContactsOverlay) pointOfContactsOverlay.classList.remove('active');
        if (suppliesSidesheet) suppliesSidesheet.classList.remove('active');
        if (portalTrainingSidesheet) portalTrainingSidesheet.classList.remove('active');
        if (siteActivationSidesheet) siteActivationSidesheet.classList.remove('active');
        
        // Hide regulatory documents sidesheet temporarily (don't close it)
        const regulatoryDocumentsOverlay = document.getElementById('regulatory-documents-sidesheet-overlay');
        if (regulatoryDocumentsOverlay) {
            regulatoryDocumentsOverlay.style.visibility = 'hidden';
        }
        
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
            
            // Return to regulatory documents sidesheet
            const regulatoryDocumentsOverlay = document.getElementById('regulatory-documents-sidesheet-overlay');
            if (regulatoryDocumentsOverlay) {
                regulatoryDocumentsOverlay.style.visibility = 'visible';
                regulatoryDocumentsOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                console.log('Returned to regulatory documents sidesheet');
            } else {
                document.body.style.overflow = 'auto';
            }
            
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

        // Check if all regulatory documents are completed
        checkRegulatoryDocumentsCompletion();
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
    
    // Initialize layout to list view by default
    initializeLayout();
    
    // Initialize with Budget & CTA section active
    filterSection('budget');
    
    // Add click event listeners to progress tracker items
    progressItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            filterSection(sectionId);
        });
    });
    

    
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

// Toggle between tabbed and list view
function toggleLayout() {
    const contentContainer = document.querySelector('.content-container');
    const layoutToggleBtn = document.querySelector('.layout-toggle-btn');
    const allTaskCards = document.querySelectorAll('.task-card');
    
    // Toggle the list view class
    contentContainer.classList.toggle('list-view');
    
    // Update button text and state
    if (contentContainer.classList.contains('list-view')) {
        layoutToggleBtn.classList.add('active');
        layoutToggleBtn.querySelector('span').textContent = 'Tab View';
        
        // In list view, show all task cards
        allTaskCards.forEach(card => {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    } else {
        layoutToggleBtn.classList.remove('active');
        layoutToggleBtn.querySelector('span').textContent = 'List View';
        
        // In tabbed view, apply the current section filter
        const activeSection = document.querySelector('.progress-item.active');
        if (activeSection) {
            const sectionId = activeSection.getAttribute('data-section');
            
            // Force filtering by temporarily removing list-view class, applying filter, then adding it back
            contentContainer.classList.remove('list-view');
            
            // Hide all task cards first
            allTaskCards.forEach(card => {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            });
            
            // Show only the active section tasks
            const targetTasks = document.querySelectorAll(`[data-section="${sectionId}"]`);
            targetTasks.forEach(task => {
                if (task.classList.contains('task-card')) {
                    task.style.display = 'flex';
                    task.style.opacity = '1';
                    task.style.transform = 'none';
                }
            });
        }
    }
}

// Initialize layout to list view by default
function initializeLayout() {
    const contentContainer = document.querySelector('.content-container');
    const layoutToggleBtn = document.querySelector('.layout-toggle-btn');
    
    // Set to list view by default
    contentContainer.classList.add('list-view');
    layoutToggleBtn.classList.add('active');
    layoutToggleBtn.querySelector('span').textContent = 'Tab View';
    
    // Don't override the section filtering - let the existing filterSection function handle it
    // The CSS will handle showing all cards in list view
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

// Document Upload Sidesheet Event Handlers
document.addEventListener('DOMContentLoaded', function() {
    // Download Document Button Click Handlers
    const downloadButtons = document.querySelectorAll('.action-btn.primary');
    downloadButtons.forEach(button => {
        if (button.textContent.trim() === 'Download Document') {
            button.addEventListener('click', function() {
                console.log('Download Document button clicked');
                showToast('Budget Downloaded', 'The budget document has been downloaded successfully.');
            });
        }
    });

    // Upload Update Button Click Handlers
    const uploadUpdateButtons = document.querySelectorAll('.action-btn');
    uploadUpdateButtons.forEach(button => {
        if (button.textContent.trim() === 'Upload Update') {
            button.addEventListener('click', function() {
                console.log('Upload Update button clicked');
                openUploadModal();
            });
        }
    });

    // Regulatory Documents Upload Area Click Handlers
    const regulatoryUploadAreas = document.querySelectorAll('.upload-area');
    regulatoryUploadAreas.forEach(uploadArea => {
        uploadArea.addEventListener('click', function(e) {
            // Don't trigger if clicking on the browse link
            if (e.target.classList.contains('upload-link')) {
                return;
            }
            
            // Create mock file based on the document type
            const documentTitle = this.closest('.document-upload-section')?.querySelector('.upload-title')?.textContent || 'Document';
            let mockFileName = 'Document.pdf';
            
            if (documentTitle.includes('PI FDF')) {
                mockFileName = 'PI_Financial_Disclosure_Form.pdf';
            } else if (documentTitle.includes('Medical License')) {
                mockFileName = 'Medical_License_and_CVs.pdf';
            } else if (documentTitle.includes('Sub-Investigator')) {
                mockFileName = 'Sub_Investigator_FDFs.pdf';
            } else if (documentTitle.includes('Protocol Signature')) {
                mockFileName = 'Protocol_Signature_Page.pdf';
            } else if (documentTitle.includes('IB Acknowledgement')) {
                mockFileName = 'IB_Acknowledgement.pdf';
            } else if (documentTitle.includes('GCP Training')) {
                mockFileName = 'GCP_Training_Certificates.pdf';
            } else if (documentTitle.includes('Lab Certificates')) {
                mockFileName = 'Lab_Certificates.pdf';
            }
            
            const mockFile = {
                name: mockFileName,
                size: '1.2 MB',
                type: 'application/pdf'
            };
            
            selectedFile = mockFile;
            this.classList.add('has-file');
            
            // Enable the upload button
            const uploadBtn = this.closest('.document-upload-section')?.querySelector('.upload-btn');
            if (uploadBtn) {
                uploadBtn.disabled = false;
            }
            
            // Update upload area text
            const uploadText = this.querySelector('.upload-text p:first-child');
            if (uploadText) {
                uploadText.textContent = `Selected: ${mockFile.name}`;
            }
            
            // Change icon to checkbox
            const uploadIcon = this.querySelector('.upload-icon img');
            if (uploadIcon) {
                uploadIcon.src = './assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg';
                uploadIcon.alt = 'File Selected';
            }
            
            // Add has-file class to icon
            const iconContainer = this.querySelector('.upload-icon');
            if (iconContainer) {
                iconContainer.classList.add('has-file');
            }
            
            console.log('Mock file added to regulatory document:', mockFile.name);
        });
    });
    // PI FDF Document Item Click Handler
    const piFdfItem = document.getElementById('pi-fdf-item');
    if (piFdfItem) {
        piFdfItem.addEventListener('click', function() {
            console.log('PI FDF item clicked');
            if (isDocumentCompleted(this)) {
                openDocumentViewer('PI FDF', 'PI_Financial_Disclosure_Form.pdf');
            } else {
                openPiFdfSidesheet();
            }
        });
    }

    // Medical License and CVs Document Item Click Handler
    const medicalLicenseCvsItem = document.getElementById('medical-license-cvs-item');
    if (medicalLicenseCvsItem) {
        medicalLicenseCvsItem.addEventListener('click', function() {
            console.log('Medical License and CVs item clicked');
            if (isDocumentCompleted(this)) {
                openDocumentViewer('Signed Medical License and CVs', 'Medical_License_and_CVs.pdf');
            } else {
                openMedicalLicenseCvsSidesheet();
            }
        });
    }

    // Sub-Investigator FDFs Document Item Click Handler
    const subInvestigatorFdfsItem = document.getElementById('sub-investigator-fdfs-item');
    if (subInvestigatorFdfsItem) {
        subInvestigatorFdfsItem.addEventListener('click', function() {
            console.log('Sub-Investigator FDFs item clicked');
            if (isDocumentCompleted(this)) {
                openDocumentViewer('Sub-Investigator FDFs', 'Sub_Investigator_FDFs.pdf');
            } else {
                openSubInvestigatorFdfsSidesheet();
            }
        });
    }

    // Protocol Signature Page Document Item Click Handler
    const protocolSignatureItem = document.getElementById('protocol-signature-item');
    if (protocolSignatureItem) {
        protocolSignatureItem.addEventListener('click', function() {
            console.log('Protocol Signature Page item clicked');
            if (isDocumentCompleted(this)) {
                openDocumentViewer('Protocol Signature Page', 'Protocol_Signature_Page.pdf');
            } else {
                openProtocolSignatureSidesheet();
            }
        });
    }

    // IB Acknowledgement Document Item Click Handler
    const ibAcknowledgementItem = document.getElementById('ib-acknowledgement-item');
    if (ibAcknowledgementItem) {
        ibAcknowledgementItem.addEventListener('click', function() {
            console.log('IB Acknowledgement item clicked');
            if (isDocumentCompleted(this)) {
                openDocumentViewer('IB Acknowledgement of Receipt', 'IB_Acknowledgement.pdf');
            } else {
                openIbAcknowledgementSidesheet();
            }
        });
    }

    // GCP Training Document Item Click Handler
    const gcpTrainingItem = document.getElementById('gcp-training-item');
    if (gcpTrainingItem) {
        gcpTrainingItem.addEventListener('click', function() {
            console.log('GCP Training item clicked');
            if (isDocumentCompleted(this)) {
                openDocumentViewer('Site Staff GCP Training and IATA Training', 'GCP_Training_Certificates.pdf');
            } else {
                openGcpTrainingSidesheet();
            }
        });
    }

    // Lab Certificates Document Item Click Handler
    const labCertificatesItem = document.getElementById('lab-certificates-item');
    if (labCertificatesItem) {
        labCertificatesItem.addEventListener('click', function() {
            console.log('Lab Certificates item clicked');
            if (isDocumentCompleted(this)) {
                openDocumentViewer('Lab Certificates (Local Labs Only)', 'Lab_Certificates.pdf');
            } else {
                openLabCertificatesSidesheet();
            }
        });
    }

    // Close buttons for all document upload sidesheets
    const closeButtons = [
        { id: 'close-pi-fdf-sidesheet', function: closePiFdfSidesheet },
        { id: 'close-medical-license-cvs-sidesheet', function: closeMedicalLicenseCvsSidesheet },
        { id: 'close-sub-investigator-fdfs-sidesheet', function: closeSubInvestigatorFdfsSidesheet },
        { id: 'close-protocol-signature-sidesheet', function: closeProtocolSignatureSidesheet },
        { id: 'close-ib-acknowledgement-sidesheet', function: closeIbAcknowledgementSidesheet },
        { id: 'close-gcp-training-sidesheet', function: closeGcpTrainingSidesheet },
        { id: 'close-lab-certificates-sidesheet', function: closeLabCertificatesSidesheet }
    ];

    closeButtons.forEach(button => {
        const closeBtn = document.getElementById(button.id);
        if (closeBtn) {
            closeBtn.addEventListener('click', button.function);
        }
    });

    // Overlay click handlers for all document upload sidesheets
    const overlayHandlers = [
        { id: 'pi-fdf-sidesheet-overlay', function: closePiFdfSidesheet },
        { id: 'medical-license-cvs-sidesheet-overlay', function: closeMedicalLicenseCvsSidesheet },
        { id: 'sub-investigator-fdfs-sidesheet-overlay', function: closeSubInvestigatorFdfsSidesheet },
        { id: 'protocol-signature-sidesheet-overlay', function: closeProtocolSignatureSidesheet },
        { id: 'ib-acknowledgement-sidesheet-overlay', function: closeIbAcknowledgementSidesheet },
        { id: 'gcp-training-sidesheet-overlay', function: closeGcpTrainingSidesheet },
        { id: 'lab-certificates-sidesheet-overlay', function: closeLabCertificatesSidesheet }
    ];

    overlayHandlers.forEach(handler => {
        const overlay = document.getElementById(handler.id);
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    handler.function();
                }
            });
        }
    });

    // Upload button handlers
    const uploadButtons = [
        { id: 'upload-pi-fdf-btn', function: handlePiFdfUpload },
        { id: 'upload-medical-license-cvs-btn', function: handleMedicalLicenseCvsUpload },
        { id: 'upload-sub-investigator-fdfs-btn', function: handleSubInvestigatorFdfsUpload },
        { id: 'upload-protocol-signature-btn', function: handleProtocolSignatureUpload },
        { id: 'upload-ib-acknowledgement-btn', function: handleIbAcknowledgementUpload },
        { id: 'upload-gcp-training-btn', function: handleGcpTrainingUpload },
        { id: 'upload-lab-certificates-btn', function: handleLabCertificatesUpload }
    ];

    uploadButtons.forEach(button => {
        const uploadBtn = document.getElementById(button.id);
        if (uploadBtn) {
            uploadBtn.addEventListener('click', button.function);
        }
    });
});

// Open functions for document upload sidesheets
function openPiFdfSidesheet() {
    const sidesheet = document.getElementById('pi-fdf-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Opened PI FDF sidesheet');
    }
}

function openMedicalLicenseCvsSidesheet() {
    const sidesheet = document.getElementById('medical-license-cvs-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Opened Medical License and CVs sidesheet');
    }
}

function openSubInvestigatorFdfsSidesheet() {
    const sidesheet = document.getElementById('sub-investigator-fdfs-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Opened Sub-Investigator FDFs sidesheet');
    }
}

function openProtocolSignatureSidesheet() {
    const sidesheet = document.getElementById('protocol-signature-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Opened Protocol Signature Page sidesheet');
    }
}

function openIbAcknowledgementSidesheet() {
    const sidesheet = document.getElementById('ib-acknowledgement-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Opened IB Acknowledgement sidesheet');
    }
}

function openGcpTrainingSidesheet() {
    const sidesheet = document.getElementById('gcp-training-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Opened GCP Training sidesheet');
    }
}

function openLabCertificatesSidesheet() {
    const sidesheet = document.getElementById('lab-certificates-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Opened Lab Certificates sidesheet');
    }
}

// Close functions for document upload sidesheets
function closePiFdfSidesheet() {
    const sidesheet = document.getElementById('pi-fdf-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed PI FDF sidesheet');
    }
}

function closeMedicalLicenseCvsSidesheet() {
    const sidesheet = document.getElementById('medical-license-cvs-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed Medical License and CVs sidesheet');
    }
}

function closeSubInvestigatorFdfsSidesheet() {
    const sidesheet = document.getElementById('sub-investigator-fdfs-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed Sub-Investigator FDFs sidesheet');
    }
}

function closeProtocolSignatureSidesheet() {
    const sidesheet = document.getElementById('protocol-signature-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed Protocol Signature Page sidesheet');
    }
}

function closeIbAcknowledgementSidesheet() {
    const sidesheet = document.getElementById('ib-acknowledgement-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed IB Acknowledgement sidesheet');
    }
}

function closeGcpTrainingSidesheet() {
    const sidesheet = document.getElementById('gcp-training-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed GCP Training sidesheet');
    }
}

function closeLabCertificatesSidesheet() {
    const sidesheet = document.getElementById('lab-certificates-sidesheet-overlay');
    if (sidesheet) {
        sidesheet.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed Lab Certificates sidesheet');
    }
}

// Upload handler functions
function handlePiFdfUpload() {
    console.log('PI FDF upload initiated');
    // Simulate file upload
    simulateFileUpload('pi-fdf-item', 'PI FDF');
}

function handleMedicalLicenseCvsUpload() {
    console.log('Medical License and CVs upload initiated');
    // Simulate file upload
    simulateFileUpload('medical-license-cvs-item', 'Signed Medical License and CVs');
}

function handleSubInvestigatorFdfsUpload() {
    console.log('Sub-Investigator FDFs upload initiated');
    // Simulate file upload
    simulateFileUpload('sub-investigator-fdfs-item', 'Sub-Investigator FDFs');
}

function handleProtocolSignatureUpload() {
    console.log('Protocol Signature Page upload initiated');
    // Simulate file upload
    simulateFileUpload('protocol-signature-item', 'Protocol Signature Page');
}

function handleIbAcknowledgementUpload() {
    console.log('IB Acknowledgement upload initiated');
    // Simulate file upload
    simulateFileUpload('ib-acknowledgement-item', 'IB Acknowledgement of Receipt');
}

function handleGcpTrainingUpload() {
    console.log('GCP Training upload initiated');
    // Simulate file upload
    simulateFileUpload('gcp-training-item', 'Site Staff GCP Training and IATA Training');
}

function handleLabCertificatesUpload() {
    console.log('Lab Certificates upload initiated');
    // Simulate file upload
    simulateFileUpload('lab-certificates-item', 'Lab Certificates (Local Labs Only)');
}

// Generic file upload simulation function
function simulateFileUpload(itemId, documentTitle) {
    const item = document.getElementById(itemId);
    if (item) {
        // Update the document status to completed
        const statusElement = item.querySelector('.document-status');
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
        const iconElement = item.querySelector('.document-icon img');
        if (iconElement) {
            iconElement.src = './assets/bc64d3813d46a4c401f1483207e7f0e8e21ac561.svg';
            iconElement.alt = 'Completed';
        }

        // Close the sidesheet
        const sidesheetId = itemId.replace('-item', '-sidesheet-overlay');
        const sidesheet = document.getElementById(sidesheetId);
        if (sidesheet) {
            sidesheet.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Update progress tracker
        updateProgressTracker('regulatory-documents');

        console.log(`${documentTitle} uploaded successfully`);
        
        // Check if all regulatory documents are completed
        checkRegulatoryDocumentsCompletion();
    }
}

// Function to check if all regulatory documents are completed
function checkRegulatoryDocumentsCompletion() {
    console.log('Checking regulatory documents completion status...');
    
    // Get all regulatory document items
    const regulatoryDocumentItems = [
        'form-1572-item',
        'pi-fdf-item',
        'medical-license-cvs-item',
        'sub-investigator-fdfs-item',
        'protocol-signature-item',
        'ib-acknowledgement-item',
        'gcp-training-item',
        'lab-certificates-item'
    ];
    
    // Check if all documents are completed
    const allCompleted = regulatoryDocumentItems.every(itemId => {
        const item = document.getElementById(itemId);
        if (item) {
            const statusElement = item.querySelector('.document-status');
            const isCompleted = statusElement && statusElement.classList.contains('completed');
            console.log(`Document ${itemId}: ${isCompleted ? 'COMPLETED' : 'PENDING'}`);
            return isCompleted;
        }
        console.log(`Document ${itemId}: NOT FOUND`);
        return false;
    });
    
    console.log(`All regulatory documents completed: ${allCompleted}`);
    
    // If all are completed, mark the main regulatory documents task as completed
    if (allCompleted) {
        markRegulatoryDocumentsTaskCompleted();
    }
}

// Function to mark the main regulatory documents task as completed
function markRegulatoryDocumentsTaskCompleted() {
    console.log('Marking main regulatory documents task as completed...');
    
    // Find the main regulatory documents task
    const regulatoryTask = document.querySelector('.task-card[data-task="regulatory-documents"]');
    if (regulatoryTask) {
        // Update task card class
        regulatoryTask.classList.remove('pending');
        regulatoryTask.classList.add('completed');
        
        // Update progress tracker to reflect the completion
        updateProgressTracker('regulatory-documents');
        
        // Debug: Check the current state
        console.log('=== DEBUG: After marking regulatory documents as completed ===');
        const docCollectionSection = document.querySelector('[data-section="doc-collection"]');
        if (docCollectionSection) {
            const completedTasks = document.querySelectorAll('.task-card[data-section="doc-collection"].completed');
            const totalTasks = document.querySelectorAll('.task-card[data-section="doc-collection"]');
            console.log(`Doc Collection: ${completedTasks.length}/${totalTasks.length} tasks completed`);
            
            const progressBadge = docCollectionSection.querySelector('.progress-badge span');
            if (progressBadge) {
                console.log(`Progress badge text: ${progressBadge.textContent}`);
            }
        }
        
        // Update task status
        const taskStatus = regulatoryTask.querySelector('.task-status');
        if (taskStatus) {
            taskStatus.classList.remove('pending');
            taskStatus.classList.add('completed');
            taskStatus.innerHTML = `
                <span>Completed</span>
                <img src="./assets/8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg" alt="Completed" width="18" height="18">
            `;
        }
        

        
        console.log('Main regulatory documents task marked as completed');
        
        // Show a toast notification
        showToast('Regulatory Documents Complete', 'All regulatory documents have been uploaded and approved!', 'success');
    } else {
        console.log('ERROR: Could not find main regulatory documents task');
    }
}

// Debug function to manually check completion status
function debugRegulatoryDocumentsStatus() {
    console.log('=== DEBUG: Checking Regulatory Documents Status ===');
    
    const regulatoryDocumentItems = [
        'form-1572-item',
        'pi-fdf-item',
        'medical-license-cvs-item',
        'sub-investigator-fdfs-item',
        'protocol-signature-item',
        'ib-acknowledgement-item',
        'gcp-training-item',
        'lab-certificates-item'
    ];
    
    regulatoryDocumentItems.forEach(itemId => {
        const item = document.getElementById(itemId);
        if (item) {
            const statusElement = item.querySelector('.document-status');
            const isCompleted = statusElement && statusElement.classList.contains('completed');
            console.log(`${itemId}: ${isCompleted ? '✅ COMPLETED' : '❌ PENDING'}`);
            
            if (statusElement) {
                console.log(`  - Classes: ${statusElement.className}`);
                console.log(`  - HTML: ${statusElement.innerHTML.substring(0, 100)}...`);
            } else {
                console.log(`  - Status element not found`);
            }
        } else {
            console.log(`${itemId}: ❌ NOT FOUND`);
        }
    });
    
    // Check main task
    const mainTask = document.querySelector('.task-card[data-task="regulatory-documents"]');
    if (mainTask) {
        console.log(`Main task found: ${mainTask.classList.contains('completed') ? '✅ COMPLETED' : '❌ PENDING'}`);
    } else {
        console.log('Main task not found');
    }
    
    console.log('=== END DEBUG ===');
}

// Helper function to check if a document is completed
function isDocumentCompleted(documentItem) {
    const statusElement = documentItem.querySelector('.document-status');
    return statusElement && statusElement.classList.contains('completed');
}

// Function to generate mock document content
function getMockDocumentContent(documentTitle, fileName) {
    const documentType = documentTitle.toLowerCase();
    
    if (documentType.includes('pi fdf')) {
        return `
            <div class="mock-document pi-fdf">
                <div class="document-header">
                    <h2>PRINCIPAL INVESTIGATOR FINANCIAL DISCLOSURE FORM</h2>
                    <div class="document-meta">
                        <span class="version">Version 2.1</span>
                        <span class="date">Date: ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="document-body">
                    <div class="section">
                        <h3>1. INVESTIGATOR INFORMATION</h3>
                        <div class="form-field">
                            <label>Full Name:</label>
                            <span>Dr. John Levinson</span>
                        </div>
                        <div class="form-field">
                            <label>Institution:</label>
                            <span>Downtown Clinical Research Center</span>
                        </div>
                        <div class="form-field">
                            <label>Position:</label>
                            <span>Principal Investigator</span>
                        </div>
                    </div>
                    <div class="section">
                        <h3>2. FINANCIAL INTERESTS</h3>
                        <div class="form-field">
                            <label>Do you have any financial interests in the sponsor?</label>
                            <span>No</span>
                        </div>
                        <div class="form-field">
                            <label>Do you own stock in the sponsor?</label>
                            <span>No</span>
                        </div>
                    </div>
                    <div class="section">
                        <h3>3. SIGNATURE</h3>
                        <div class="signature-line">
                            <span>Dr. John Levinson</span>
                            <span class="date">${new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (documentType.includes('medical license')) {
        return `
            <div class="mock-document medical-license">
                <div class="document-header">
                    <h2>MEDICAL LICENSE AND CURRICULUM VITAE</h2>
                    <div class="document-meta">
                        <span class="institution">Downtown Clinical Research Center</span>
                        <span class="date">Updated: ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="document-body">
                    <div class="section">
                        <h3>MEDICAL LICENSE</h3>
                        <div class="license-info">
                            <div class="form-field">
                                <label>License Number:</label>
                                <span>MD-123456</span>
                            </div>
                            <div class="form-field">
                                <label>State:</label>
                                <span>California</span>
                            </div>
                            <div class="form-field">
                                <label>Expiration Date:</label>
                                <span>December 31, 2026</span>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <h3>CURRICULUM VITAE</h3>
                        <div class="cv-content">
                            <h4>Education</h4>
                            <p>MD - Stanford University School of Medicine (2010)</p>
                            <p>Residency - Internal Medicine, UCSF Medical Center (2010-2013)</p>
                            
                            <h4>Experience</h4>
                            <p>Principal Investigator - Downtown Clinical Research Center (2015-Present)</p>
                            <p>Clinical Research Experience: 15+ years</p>
                            
                            <h4>Certifications</h4>
                            <p>Board Certified in Internal Medicine</p>
                            <p>GCP Certified</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (documentType.includes('protocol signature')) {
        return `
            <div class="mock-document protocol-signature">
                <div class="document-header">
                    <h2>PROTOCOL SIGNATURE PAGE</h2>
                    <div class="document-meta">
                        <span class="protocol">Protocol: ARC-2024-001</span>
                        <span class="date">Date: ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="document-body">
                    <div class="section">
                        <h3>PROTOCOL ACKNOWLEDGMENT</h3>
                        <p class="acknowledgment">
                            I acknowledge that I have received, read, and understood the protocol 
                            "A Phase 3 Study of Investigational Drug in Type 2 Diabetes Patients" 
                            and agree to conduct the study in accordance with the protocol, 
                            applicable regulations, and institutional policies.
                        </p>
                    </div>
                    <div class="section">
                        <h3>INVESTIGATOR SIGNATURE</h3>
                        <div class="signature-block">
                            <div class="signature-line">
                                <label>Principal Investigator:</label>
                                <span>Dr. John Levinson</span>
                            </div>
                            <div class="signature-line">
                                <label>Date:</label>
                                <span>${new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <h3>INSTITUTIONAL APPROVAL</h3>
                        <div class="approval-info">
                            <div class="form-field">
                                <label>IRB Approval Date:</label>
                                <span>January 15, 2024</span>
                            </div>
                            <div class="form-field">
                                <label>IRB Number:</label>
                                <span>IRB-2024-001</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (documentType.includes('ib acknowledgement')) {
        return `
            <div class="mock-document ib-acknowledgment">
                <div class="document-header">
                    <h2>INVESTIGATOR'S BROCHURE ACKNOWLEDGMENT</h2>
                    <div class="document-meta">
                        <span class="version">IB Version 3.2</span>
                        <span class="date">Date: ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="document-body">
                    <div class="section">
                        <h3>ACKNOWLEDGMENT STATEMENT</h3>
                        <p class="acknowledgment">
                            I acknowledge that I have received the Investigator's Brochure for 
                            the investigational drug and understand that it contains important 
                            safety information and clinical data that I must review before 
                            conducting the study.
                        </p>
                    </div>
                    <div class="section">
                        <h3>INVESTIGATOR INFORMATION</h3>
                        <div class="investigator-info">
                            <div class="form-field">
                                <label>Name:</label>
                                <span>Dr. John Levinson</span>
                            </div>
                            <div class="form-field">
                                <label>Institution:</label>
                                <span>Downtown Clinical Research Center</span>
                            </div>
                            <div class="form-field">
                                <label>Study Role:</label>
                                <span>Principal Investigator</span>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <h3>SIGNATURE</h3>
                        <div class="signature-block">
                            <div class="signature-line">
                                <span>Dr. John Levinson</span>
                                <span class="date">${new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (documentType.includes('gcp training')) {
        return `
            <div class="mock-document gcp-training">
                <div class="document-header">
                    <h2>GCP AND IATA TRAINING CERTIFICATES</h2>
                    <div class="document-meta">
                        <span class="institution">Downtown Clinical Research Center</span>
                        <span class="date">Updated: ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="document-body">
                    <div class="section">
                        <h3>GOOD CLINICAL PRACTICE (GCP) TRAINING</h3>
                        <div class="certificate-info">
                            <div class="form-field">
                                <label>Training Provider:</label>
                                <span>NIH Clinical Center</span>
                            </div>
                            <div class="form-field">
                                <label>Completion Date:</label>
                                <span>March 15, 2024</span>
                            </div>
                            <div class="form-field">
                                <label>Expiration Date:</label>
                                <span>March 15, 2027</span>
                            </div>
                            <div class="form-field">
                                <label>Certificate Number:</label>
                                <span>GCP-2024-001</span>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <h3>IATA DANGEROUS GOODS TRAINING</h3>
                        <div class="certificate-info">
                            <div class="form-field">
                                <label>Training Provider:</label>
                                <span>IATA Training Institute</span>
                            </div>
                            <div class="form-field">
                                <label>Completion Date:</label>
                                <span>February 20, 2024</span>
                            </div>
                            <div class="form-field">
                                <label>Expiration Date:</label>
                                <span>February 20, 2026</span>
                            </div>
                            <div class="form-field">
                                <label>Certificate Number:</label>
                                <span>IATA-2024-002</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (documentType.includes('lab certificates')) {
        return `
            <div class="mock-document lab-certificates">
                <div class="document-header">
                    <h2>LABORATORY CERTIFICATES AND ACCREDITATIONS</h2>
                    <div class="document-meta">
                        <span class="institution">Downtown Clinical Research Center</span>
                        <span class="date">Updated: ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="document-body">
                    <div class="section">
                        <h3>CLIA CERTIFICATION</h3>
                        <div class="certificate-info">
                            <div class="form-field">
                                <label>CLIA Number:</label>
                                <span>05D1234567</span>
                            </div>
                            <div class="form-field">
                                <label>Certification Date:</label>
                                <span>January 10, 2024</span>
                            </div>
                            <div class="form-field">
                                <label>Expiration Date:</label>
                                <span>January 10, 2026</span>
                            </div>
                            <div class="form-field">
                                <label>Laboratory Director:</label>
                                <span>Dr. Sarah Johnson</span>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <h3>CAP ACCREDITATION</h3>
                        <div class="certificate-info">
                            <div class="form-field">
                                <label>CAP Number:</label>
                                <span>CAP-123456</span>
                            </div>
                            <div class="form-field">
                                <label>Accreditation Date:</label>
                                <span>December 5, 2023</span>
                            </div>
                            <div class="form-field">
                                <label>Next Inspection:</label>
                                <span>December 5, 2025</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Default generic document
        return `
            <div class="mock-document generic">
                <div class="document-header">
                    <h2>${documentTitle.toUpperCase()}</h2>
                    <div class="document-meta">
                        <span class="filename">${fileName}</span>
                        <span class="date">Date: ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="document-body">
                    <div class="section">
                        <h3>DOCUMENT CONTENT</h3>
                        <p>This document contains the required information for ${documentTitle}.</p>
                        <p>The document has been reviewed and approved by the appropriate authorities.</p>
                    </div>
                    <div class="section">
                        <h3>APPROVAL</h3>
                        <div class="approval-info">
                            <div class="form-field">
                                <label>Status:</label>
                                <span>Approved</span>
                            </div>
                            <div class="form-field">
                                <label>Date:</label>
                                <span>${new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Function to open document viewer for completed documents
function openDocumentViewer(documentTitle, fileName) {
    console.log(`Opening document viewer for: ${documentTitle}`);
    
    // Get mock document content based on document type
    const mockContent = getMockDocumentContent(documentTitle, fileName);
    
    // Create a document viewer modal with mock content
    const viewerHTML = `
        <div id="document-viewer-overlay" class="document-viewer-overlay">
            <div class="document-viewer-container">
                <div class="document-viewer-header">
                    <h3 class="document-viewer-title">${documentTitle}</h3>
                    <button class="document-viewer-close" id="close-document-viewer">
                        <img src="./assets/x_close.svg" alt="Close" width="24" height="24">
                    </button>
                </div>
                <div class="document-viewer-content">
                    <div class="document-preview-area">
                        <div class="document-preview-content">
                            ${mockContent}
                        </div>
                    </div>
                    <div class="document-viewer-actions">
                        <button class="document-viewer-btn primary" onclick="downloadDocument('${fileName}')">
                            Download Document
                        </button>
                        <button class="document-viewer-btn secondary" onclick="closeDocumentViewer()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add the viewer to the page
    document.body.insertAdjacentHTML('beforeend', viewerHTML);
    
    // Show the viewer
    const viewer = document.getElementById('document-viewer-overlay');
    if (viewer) {
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Add close event listener
    const closeBtn = document.getElementById('close-document-viewer');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDocumentViewer);
    }
    
    // Close on overlay click
    if (viewer) {
        viewer.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDocumentViewer();
            }
        });
    }
}

// Function to close document viewer
function closeDocumentViewer() {
    const viewer = document.getElementById('document-viewer-overlay');
    if (viewer) {
        viewer.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove the viewer from DOM after animation
        setTimeout(() => {
            if (viewer.parentNode) {
                viewer.parentNode.removeChild(viewer);
            }
        }, 300);
    }
}

// Function to simulate document download
function downloadDocument(fileName) {
    console.log(`Downloading: ${fileName}`);
    showToast('Document Downloaded', `${fileName} has been downloaded successfully.`);
}

// Toast Notification Functions
function showToast(title, message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        console.error('Toast container not found');
        return;
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'toast-' + Date.now();

    // Set icon based on type
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#40c057" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fa5252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 16H12L9 13H4L2 15V7L4 5H9L12 2L13 3V16Z" stroke="#228be6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }

    // Set toast content
    toast.innerHTML = `
        <div class="toast-icon">
            ${iconSvg}
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast('${toast.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `;

    // Add toast to container
    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
        closeToast(toast.id);
    }, 5000);

    console.log('Toast notification shown:', title);
}

function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// Upload Modal Functions
let selectedFile = null;

function openUploadModal() {
    const modal = document.getElementById('upload-update-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Upload modal opened');
    }
}

function closeUploadModal() {
    const modal = document.getElementById('upload-update-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        resetUploadModal();
        console.log('Upload modal closed');
    }
}

function resetUploadModal() {
    selectedFile = null;
    const uploadArea = document.querySelector('.upload-area-modal');
    const progress = document.getElementById('upload-progress');
    const success = document.getElementById('upload-success');
    const confirmBtn = document.getElementById('confirm-upload');
    const fileInput = document.getElementById('file-input');
    
    if (uploadArea) {
        uploadArea.classList.remove('has-file');
        
        // Reset upload area text
        const uploadText = uploadArea.querySelector('.upload-text-modal p:first-child');
        if (uploadText) {
            uploadText.textContent = 'Drag and drop your updated budget file here, or browse';
        }
        
        // Reset icon to original upload icon
        const uploadIcon = uploadArea.querySelector('.upload-icon-modal img');
        if (uploadIcon) {
            uploadIcon.src = './assets/34089f7cf686190c349d049f1a68a424621dc759.svg';
            uploadIcon.alt = 'Upload';
        }
    }
    
    if (progress) progress.style.display = 'none';
    if (success) success.style.display = 'none';
    if (confirmBtn) confirmBtn.disabled = true;
    if (fileInput) fileInput.value = '';
}

// Upload Modal Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('upload-update-modal');
    const closeBtn = document.getElementById('close-upload-modal');
    const cancelBtn = document.getElementById('cancel-upload');
    const confirmBtn = document.getElementById('confirm-upload');
    const browseBtn = document.getElementById('browse-files');
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.querySelector('.upload-area-modal');

    // Close modal when clicking overlay
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeUploadModal();
            }
        });
    }

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeUploadModal);
    }

    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeUploadModal);
    }

    // Browse files
    if (browseBtn) {
        browseBtn.addEventListener('click', function() {
            // Create mock file instead of opening file picker
            const mockFile = {
                name: 'ArcadiaSiteBudgetV4.xls',
                size: '2.4 MB',
                type: 'application/vnd.ms-excel'
            };
            
            selectedFile = mockFile;
            uploadArea.classList.add('has-file');
            confirmBtn.disabled = false;
            
            // Update upload area text
            const uploadText = uploadArea.querySelector('.upload-text-modal p:first-child');
            if (uploadText) {
                uploadText.textContent = `Selected: ${mockFile.name}`;
            }
            
            // Change icon to checkbox
            const uploadIcon = uploadArea.querySelector('.upload-icon-modal img');
            if (uploadIcon) {
                uploadIcon.src = './assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg';
                uploadIcon.alt = 'File Selected';
            }
            
            console.log('Mock file added via browse:', mockFile.name);
        });
    }

    // Regulatory Documents Browse Links
    const regulatoryBrowseLinks = document.querySelectorAll('.upload-link');
    regulatoryBrowseLinks.forEach(browseLink => {
        browseLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const uploadArea = this.closest('.upload-area');
            if (!uploadArea) return;
            
            // Create mock file based on the document type
            const documentTitle = uploadArea.closest('.document-upload-section')?.querySelector('.upload-title')?.textContent || 'Document';
            let mockFileName = 'Document.pdf';
            
            if (documentTitle.includes('PI FDF')) {
                mockFileName = 'PI_Financial_Disclosure_Form.pdf';
            } else if (documentTitle.includes('Medical License')) {
                mockFileName = 'Medical_License_and_CVs.pdf';
            } else if (documentTitle.includes('Sub-Investigator')) {
                mockFileName = 'Sub_Investigator_FDFs.pdf';
            } else if (documentTitle.includes('Protocol Signature')) {
                mockFileName = 'Protocol_Signature_Page.pdf';
            } else if (documentTitle.includes('IB Acknowledgement')) {
                mockFileName = 'IB_Acknowledgement.pdf';
            } else if (documentTitle.includes('GCP Training')) {
                mockFileName = 'GCP_Training_Certificates.pdf';
            } else if (documentTitle.includes('Lab Certificates')) {
                mockFileName = 'Lab_Certificates.pdf';
            }
            
            const mockFile = {
                name: mockFileName,
                size: '1.2 MB',
                type: 'application/pdf'
            };
            
            selectedFile = mockFile;
            uploadArea.classList.add('has-file');
            
            // Enable the upload button
            const uploadBtn = uploadArea.closest('.document-upload-section')?.querySelector('.upload-btn');
            if (uploadBtn) {
                uploadBtn.disabled = false;
            }
            
            // Update upload area text
            const uploadText = uploadArea.querySelector('.upload-text p:first-child');
            if (uploadText) {
                uploadText.textContent = `Selected: ${mockFile.name}`;
            }
            
            // Change icon to checkbox
            const uploadIcon = uploadArea.querySelector('.upload-icon img');
            if (uploadIcon) {
                uploadIcon.src = './assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg';
                uploadIcon.alt = 'File Selected';
            }
            
            // Add has-file class to icon
            const iconContainer = uploadArea.querySelector('.upload-icon');
            if (iconContainer) {
                iconContainer.classList.add('has-file');
            }
            
            console.log('Mock file added to regulatory document via browse:', mockFile.name);
        });
    });

    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                selectedFile = file;
                uploadArea.classList.add('has-file');
                confirmBtn.disabled = false;
                
                // Update upload area text
                const uploadText = uploadArea.querySelector('.upload-text-modal p:first-child');
                if (uploadText) {
                    uploadText.textContent = `Selected: ${file.name}`;
                }
            }
        });
    }

    // Auto-add mock file when clicking upload area
    if (uploadArea) {
        uploadArea.addEventListener('click', function(e) {
            // Don't trigger if clicking on the browse link
            if (e.target.classList.contains('upload-link-modal')) {
                return;
            }
            
            // Create mock file
            const mockFile = {
                name: 'ArcadiaSiteBudgetV4.xls',
                size: '2.4 MB',
                type: 'application/vnd.ms-excel'
            };
            
            selectedFile = mockFile;
            this.classList.add('has-file');
            confirmBtn.disabled = false;
            
            // Update upload area text
            const uploadText = this.querySelector('.upload-text-modal p:first-child');
            if (uploadText) {
                uploadText.textContent = `Selected: ${mockFile.name}`;
            }
            
            // Change icon to checkbox
            const uploadIcon = this.querySelector('.upload-icon-modal img');
            if (uploadIcon) {
                uploadIcon.src = './assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg';
                uploadIcon.alt = 'File Selected';
            }
            
            console.log('Mock file added:', mockFile.name);
        });
    }

    // Drag and drop functionality
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            // Create mock file instead of using actual dropped files
            const mockFile = {
                name: 'ArcadiaSiteBudgetV4.xls',
                size: '2.4 MB',
                type: 'application/vnd.ms-excel'
            };
            
            selectedFile = mockFile;
            this.classList.add('has-file');
            confirmBtn.disabled = false;
            
            // Update upload area text
            const uploadText = this.querySelector('.upload-text-modal p:first-child');
            if (uploadText) {
                uploadText.textContent = `Selected: ${mockFile.name}`;
            }
            
            // Change icon to checkbox
            const uploadIcon = this.querySelector('.upload-icon-modal img');
            if (uploadIcon) {
                uploadIcon.src = './assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg';
                uploadIcon.alt = 'File Selected';
            }
            
            console.log('Mock file added via drag and drop:', mockFile.name);
        });
    }

    // Regulatory Documents Upload Areas Drag and Drop
    const regulatoryUploadAreas = document.querySelectorAll('.upload-area');
    regulatoryUploadAreas.forEach(uploadArea => {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            // Create mock file based on the document type
            const documentTitle = this.closest('.document-upload-section')?.querySelector('.upload-title')?.textContent || 'Document';
            let mockFileName = 'Document.pdf';
            
            if (documentTitle.includes('PI FDF')) {
                mockFileName = 'PI_Financial_Disclosure_Form.pdf';
            } else if (documentTitle.includes('Medical License')) {
                mockFileName = 'Medical_License_and_CVs.pdf';
            } else if (documentTitle.includes('Sub-Investigator')) {
                mockFileName = 'Sub_Investigator_FDFs.pdf';
            } else if (documentTitle.includes('Protocol Signature')) {
                mockFileName = 'Protocol_Signature_Page.pdf';
            } else if (documentTitle.includes('IB Acknowledgement')) {
                mockFileName = 'IB_Acknowledgement.pdf';
            } else if (documentTitle.includes('GCP Training')) {
                mockFileName = 'GCP_Training_Certificates.pdf';
            } else if (documentTitle.includes('Lab Certificates')) {
                mockFileName = 'Lab_Certificates.pdf';
            }
            
            const mockFile = {
                name: mockFileName,
                size: '1.2 MB',
                type: 'application/pdf'
            };
            
            selectedFile = mockFile;
            this.classList.add('has-file');
            
            // Enable the upload button
            const uploadBtn = this.closest('.document-upload-section')?.querySelector('.upload-btn');
            if (uploadBtn) {
                uploadBtn.disabled = false;
            }
            
            // Update upload area text
            const uploadText = this.querySelector('.upload-text p:first-child');
            if (uploadText) {
                uploadText.textContent = `Selected: ${mockFile.name}`;
            }
            
            // Change icon to checkbox
            const uploadIcon = this.querySelector('.upload-icon img');
            if (uploadIcon) {
                uploadIcon.src = './assets/2fd5f8d407e64971be64b8cac59706ee27a3b771.svg';
                uploadIcon.alt = 'File Selected';
            }
            
            // Add has-file class to icon
            const iconContainer = this.querySelector('.upload-icon');
            if (iconContainer) {
                iconContainer.classList.add('has-file');
            }
            
            console.log('Mock file added to regulatory document via drag and drop:', mockFile.name);
        });
    });

    // Confirm upload
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (selectedFile) {
                simulateUpload();
            }
        });
    }
});

function simulateUpload() {
    const progress = document.getElementById('upload-progress');
    const success = document.getElementById('upload-success');
    const uploadArea = document.querySelector('.upload-area-modal');
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const confirmBtn = document.getElementById('confirm-upload');

    // Hide upload area and show progress
    uploadArea.style.display = 'none';
    progress.style.display = 'block';
    confirmBtn.disabled = true;

    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress > 100) currentProgress = 100;
        
        progressFill.style.width = currentProgress + '%';
        progressPercentage.textContent = Math.round(currentProgress) + '%';
        
        if (currentProgress >= 100) {
            clearInterval(interval);
            
            // Show success message
            setTimeout(() => {
                progress.style.display = 'none';
                success.style.display = 'flex';
                
                // Update budget version and add comment
                updateBudgetVersion();
                addUploadComment();
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    closeUploadModal();
                    showToast('Budget Updated', 'Your budget has been updated to version v4 successfully.');
                }, 2000);
            }, 500);
        }
    }, 200);
}

function updateBudgetVersion() {
    // Update the version badge from v3 to v4
    const versionBadge = document.querySelector('.meta-badge');
    if (versionBadge && versionBadge.textContent === 'v3') {
        versionBadge.textContent = 'v4';
    }
    
    // Update the last modified date
    const metaDate = document.querySelector('.meta-date');
    if (metaDate) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        };
        metaDate.textContent = `Last modified ${now.toLocaleDateString('en-US', options)}`;
    }
    
    // Hide the approve button after upload
    const approveBtn = document.getElementById('approve-budget');
    if (approveBtn) {
        approveBtn.style.display = 'none';
        console.log('Approve button hidden after budget upload');
    }
}

function addUploadComment() {
    const activityFeed = document.getElementById('activity-feed');
    if (activityFeed) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const timeString = now.toLocaleDateString('en-US', options);
        
        const newComment = document.createElement('div');
        newComment.className = 'activity-item';
        newComment.innerHTML = `
            <div class="activity-avatar">HW</div>
            <div class="activity-content">
                <div class="activity-header">
                    <span class="activity-user">Herbert Wright</span>
                    <span class="activity-action">uploaded</span>
                    <span class="activity-document">Arcadia Site Budget v4</span>
                    <span class="activity-time">${timeString}</span>
                </div>
                <div class="activity-text">
                    New budget version uploaded
                </div>
                <div class="activity-file">
                    <img src="./assets/667e3d9f36857ce2e0212ecdbccf6ac42e50cd9e.svg" alt="Excel" width="12" height="12">
                    <span>ArcadiaSiteBudgetV4.xls</span>
                </div>
            </div>
        `;
        
        // Insert at the top of the activity feed
        activityFeed.insertBefore(newComment, activityFeed.firstChild);
    }
}
