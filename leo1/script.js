// Configurations
const CONFIG = {
    bookPages: 14,             // Total number of pages in the book
    autoShowEndSurvey: true,   // Automatically show survey at the end
    trackingEnabled: true,     // Enable anonymous tracking
    swipeThreshold: 50,        // Minimum swipe distance to trigger page turn
    animationSpeed: 300,       // Page turn animation duration in ms
};

// Firebase-like data structure (replace with actual Firebase config if available)
const db = {
    feedbackEntries: [],
    saveEntry: function(entry) {
        // Generate a unique ID for the entry
        const entryId = 'entry_' + Date.now();
        
        // Save to local array (would be Firebase in production)
        this.feedbackEntries.push({
            id: entryId,
            ...entry
        });
        
        // Log to console (for development purposes)
        console.log('Feedback saved:', entry);
        
        // In a real implementation, this would save to Firebase
        // firebase.database().ref('feedback_entries/' + entryId).set(entry);
        
        return entryId;
    }
};

// State management
const state = {
    currentPage: 1,
    pagesViewed: new Set([1]),
    bookCompleted: false,
    surveyShown: false,
    startTime: Date.now(),
    pageViewTimes: {},
    deviceType: getDeviceType(),
    feedback: {
        purchase_interest: null,
        price_preference: null,
        email: null
    },
    survey: {
        enjoyed_book: null,
        purchase_interest: null,
        price_preference: null,
        email: null
    },
    
    trackPageView: function(pageNum) {
        this.pagesViewed.add(pageNum);
        
        // Track time spent on previous page
        const now = Date.now();
        const prevPage = pageNum > 1 ? pageNum - 1 : null;
        
        if (prevPage && !this.pageViewTimes[prevPage]?.endTime) {
            this.pageViewTimes[prevPage] = {
                ...this.pageViewTimes[prevPage],
                endTime: now
            };
        }
        
        // Start tracking time for current page
        this.pageViewTimes[pageNum] = {
            startTime: now,
            endTime: null
        };
        
        // Check if book is completed
        if (pageNum === CONFIG.bookPages && !this.bookCompleted) {
            this.bookCompleted = true;
            if (CONFIG.autoShowEndSurvey && !this.surveyShown) {
                setTimeout(() => {
                    openEndSurvey();
                }, 1000);
            }
        }
    }
};

// DOM Elements
const elements = {
    bookViewer: document.getElementById('book-viewer'),
    currentPageEl: document.getElementById('current-page'),
    totalPagesEl: document.getElementById('total-pages'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    feedbackBtn: document.getElementById('feedback-btn'),
    feedbackModal: document.getElementById('feedback-modal'),
    endSurveyModal: document.getElementById('end-survey-modal'),
    closeModalBtns: document.querySelectorAll('.close-modal'),
    purchaseOptions: document.querySelectorAll('.purchase-option'),
    priceQuestion: document.getElementById('price-question'),
    emailQuestion: document.getElementById('email-question'),
    submitFeedback: document.getElementById('submit-feedback'),
    skipFeedback: document.getElementById('skip-feedback'),
    feedbackThanks: document.getElementById('feedback-thanks'),
    feedbackForm: document.getElementById('feedback-form'),
    surveyForm: document.getElementById('survey-form'),
    enjoyedOptions: document.querySelectorAll('.enjoyed-option'),
    purchaseSurveyOptions: document.querySelectorAll('.purchase-survey-option'),
    surveyPriceQuestion: document.getElementById('survey-price-question'),
    submitSurvey: document.getElementById('submit-survey'),
    skipSurvey: document.getElementById('skip-survey'),
    surveyThanks: document.getElementById('survey-thanks')
};

// Initialize the book viewer
function initBookViewer() {
    // Set total pages
    elements.totalPagesEl.textContent = CONFIG.bookPages;
    
    // Create image elements for each page
    for (let i = 1; i <= CONFIG.bookPages; i++) {
        const pageImg = document.createElement('img');
        pageImg.src = `page-${i}.jpg`; // Replace with actual path to your images
        pageImg.alt = `Seite ${i} des Buches "Leo Löwe beim Zahnarzt"`;
        pageImg.classList.add('book-page');
        pageImg.dataset.page = i;
        
        // Make first page active
        if (i === 1) {
            pageImg.classList.add('active');
        }
        
        elements.bookViewer.appendChild(pageImg);
    }
    
    // Initialize navigation
    updateNavButtons();
    
    // Track initial page view
    state.trackPageView(1);
}

// Navigation functions
function goToPage(pageNum) {
    if (pageNum < 1 || pageNum > CONFIG.bookPages) return;
    
    const currentPage = document.querySelector('.book-page.active');
    const targetPage = document.querySelector(`.book-page[data-page="${pageNum}"]`);
    
    if (!targetPage || currentPage === targetPage) return;
    
    // Handle direction (for animations)
    const isForward = pageNum > state.currentPage;
    
    // Update classes for animation
    document.querySelectorAll('.book-page').forEach(page => {
        page.classList.remove('active', 'prev');
    });
    
    if (isForward) {
        currentPage.classList.add('prev');
    }
    
    targetPage.classList.add('active');
    
    // Update state
    state.currentPage = pageNum;
    elements.currentPageEl.textContent = pageNum;
    
    // Update navigation
    updateNavButtons();
    
    // Track page view
    state.trackPageView(pageNum);
}

function goToPrevPage() {
    goToPage(state.currentPage - 1);
}

function goToNextPage() {
    goToPage(state.currentPage + 1);
}

function updateNavButtons() {
    // Disable prev button on first page
    elements.prevBtn.disabled = state.currentPage <= 1;
    
    // Disable next button on last page
    elements.nextBtn.disabled = state.currentPage >= CONFIG.bookPages;
}

// Modal functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function openFeedbackModal() {
    openModal(elements.feedbackModal);
}

function openEndSurvey() {
    state.surveyShown = true;
    openModal(elements.endSurveyModal);
}

// Feedback form handling
function handlePurchaseOptionClick(event) {
    const option = event.target;
    const value = option.dataset.value;
    
    // Remove selected class from all options
    elements.purchaseOptions.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked option
    option.classList.add('selected');
    
    // Store value
    state.feedback.purchase_interest = value;
    
    // Show/hide additional questions based on response
    if (value === 'yes' || value === 'maybe') {
        elements.priceQuestion.classList.remove('hidden');
        elements.emailQuestion.classList.remove('hidden');
    } else {
        elements.priceQuestion.classList.add('hidden');
        elements.emailQuestion.classList.add('hidden');
    }
}

function handleSurveyPurchaseOptionClick(event) {
    const option = event.target;
    const value = option.dataset.value;
    
    // Remove selected class from all options
    elements.purchaseSurveyOptions.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked option
    option.classList.add('selected');
    
    // Store value
    state.survey.purchase_interest = value;
    
    // Show/hide price question based on response
    if (value === 'yes' || value === 'maybe') {
        elements.surveyPriceQuestion.classList.remove('hidden');
    } else {
        elements.surveyPriceQuestion.classList.add('hidden');
    }
}

function handleEnjoyedOptionClick(event) {
    const option = event.target;
    const value = option.dataset.value;
    
    // Remove selected class from all options
    elements.enjoyedOptions.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked option
    option.classList.add('selected');
    
    // Store value
    state.survey.enjoyed_book = value === 'yes';
}

function submitFeedbackForm() {
    // Get additional values
    const priceSelect = document.getElementById('price-select');
    const emailInput = document.getElementById('email-input');
    
    state.feedback.price_preference = state.feedback.purchase_interest === 'yes' || state.feedback.purchase_interest === 'maybe' 
        ? priceSelect.value 
        : null;
    
    state.feedback.email = emailInput.value.trim() || null;
    
    // Save feedback
    saveFeedbackData();
    
    // Show thank you message
    elements.feedbackForm.classList.add('hidden');
    elements.feedbackThanks.classList.remove('hidden');
    
    // Close modal after delay
    setTimeout(() => {
        closeModal(elements.feedbackModal);
        
        // Reset form for next time
        setTimeout(() => {
            elements.feedbackForm.classList.remove('hidden');
            elements.feedbackThanks.classList.add('hidden');
            elements.purchaseOptions.forEach(btn => btn.classList.remove('selected'));
            elements.priceQuestion.classList.add('hidden');
            elements.emailQuestion.classList.add('hidden');
            document.getElementById('email-input').value = '';
        }, 500);
    }, 2000);
}

function submitSurveyForm() {
    // Get additional values
    const priceSelect = document.getElementById('survey-price-select');
    const emailInput = document.getElementById('survey-email-input');
    
    state.survey.price_preference = state.survey.purchase_interest === 'yes' || state.survey.purchase_interest === 'maybe' 
        ? priceSelect.value 
        : null;
    
    state.survey.email = emailInput.value.trim() || null;
    
    // Save survey data
    saveSurveyData();
    
    // Show thank you message
    elements.surveyForm.classList.add('hidden');
    elements.surveyThanks.classList.remove('hidden');
    
    // Close modal after delay
    setTimeout(() => {
        closeModal(elements.endSurveyModal);
    }, 3000);
}

// Data saving
function saveFeedbackData() {
    const feedbackData = {
        timestamp: Date.now(),
        device_type: state.deviceType,
        pages_viewed: Array.from(state.pagesViewed),
        completed_book: state.bookCompleted,
        purchase_interest: state.feedback.purchase_interest,
        price_preference: state.feedback.price_preference,
        email: state.feedback.email,
        page_view_times: state.pageViewTimes
    };
    
    db.saveEntry(feedbackData);
}

function saveSurveyData() {
    const surveyData = {
        timestamp: Date.now(),
        device_type: state.deviceType,
        pages_viewed: Array.from(state.pagesViewed),
        completed_book: state.bookCompleted,
        enjoyed_book: state.survey.enjoyed_book,
        purchase_interest: state.survey.purchase_interest,
        price_preference: state.survey.price_preference,
        email: state.survey.email,
        page_view_times: state.pageViewTimes,
        total_time_spent: Date.now() - state.startTime
    };
    
    db.saveEntry(surveyData);
}

// Helper functions
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

// Touch/swipe handling
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) < CONFIG.swipeThreshold) return;
    
    if (swipeDistance > 0) {
        // Swiped right (go to previous page)
        goToPrevPage();
    } else {
        // Swiped left (go to next page)
        goToNextPage();
    }
}

// Zoom functionality
function handlePageClick(event) {
    const page = event.target.closest('.book-page');
    if (!page) return;
    
    if (page.classList.contains('zoomed')) {
        page.classList.remove('zoomed');
    } else {
        page.classList.add('zoomed');
    }
}

// Event listeners
function setupEventListeners() {
    // Navigation
    elements.prevBtn.addEventListener('click', goToPrevPage);
    elements.nextBtn.addEventListener('click', goToNextPage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') goToPrevPage();
        if (event.key === 'ArrowRight' || event.key === ' ') goToNextPage();
    });
    
    // Touch/swipe
    elements.bookViewer.addEventListener('touchstart', handleTouchStart, { passive: true });
    elements.bookViewer.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Click/zoom on pages
    elements.bookViewer.addEventListener('click', handlePageClick);
    
    // Feedback button
    elements.feedbackBtn.addEventListener('click', openFeedbackModal);
    
    // Close modals
    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Click outside modal to close
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
    
    // Purchase options in feedback
    elements.purchaseOptions.forEach(option => {
        option.addEventListener('click', handlePurchaseOptionClick);
    });
    
    // Purchase options in end survey
    elements.purchaseSurveyOptions.forEach(option => {
        option.addEventListener('click', handleSurveyPurchaseOptionClick);
    });
    
    // Enjoyed book options
    elements.enjoyedOptions.forEach(option => {
        option.addEventListener('click', handleEnjoyedOptionClick);
    });
    
    // Submit feedback
    elements.submitFeedback.addEventListener('click', submitFeedbackForm);
    elements.skipFeedback.addEventListener('click', () => {
        closeModal(elements.feedbackModal);
    });
    
    // Submit survey
    elements.submitSurvey.addEventListener('click', submitSurveyForm);
    elements.skipSurvey.addEventListener('click', () => {
        closeModal(elements.endSurveyModal);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initBookViewer();
    setupEventListeners();
    
    // Set CSS variable for animation speed
    document.documentElement.style.setProperty('--transition-normal', `${CONFIG.animationSpeed / 1000}s ease`);
});