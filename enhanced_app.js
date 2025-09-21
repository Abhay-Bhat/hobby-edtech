// UPSC + Technical Excellence Tracker - Enhanced Complete JavaScript

// Configuration
const CONFIG = {
    ROWS_PER_PAGE: 20,
    STORAGE_KEY: 'upsc_excellence_tracker',
    START_DATE: new Date('2025-09-21'),
    PRELIMS_DATE: new Date('2026-05-24'),
    MAINS_DATE: new Date('2026-08-28')
};

// Global Variables
let currentSection = 'home';
let trackerData = [];
let filteredData = [];
let currentPage = 1;
let userNotes = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Initializing UPSC + Tech Excellence Tracker...');

    // Load user data
    loadUserData();

    // Generate complete tracker data
    generateTrackerData();

    // Set up navigation
    setupNavigation();

    // Initialize home page
    initializeHomePage();

    // Setup event listeners
    setupEventListeners();

    // Initialize enhanced analysis features
    initializeAnalysisFeatures();

    console.log('Application initialized successfully with enhanced analysis');
}

function loadUserData() {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (stored) {
            userNotes = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        userNotes = {};
    }
}

function saveUserData() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(userNotes));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

function generateTrackerData() {
    // Generate complete 467-day study plan
    trackerData = [];
    const startDate = new Date(CONFIG.START_DATE);

    // Subject cycles for GS1 (weekly rotation)
    const gs1Subjects = [
        'Geography', 'International Relations', 'Economy', 
        'Ethics, Integrity and Aptitude', 'Internal Security',
        'Environment and Ecology', 'Science and Technology'
    ];

    // Current Affairs themes (bi-weekly rotation)
    const caThemes = [
        'Economy', 'Science and Tech', 'Environment and Ecology',
        'Social Issues', 'International Relations', 'Yojana & Kurukshetra',
        'Art and Culture'
    ];

    // GS2 weekend topics
    const gs2Topics = [
        'Ancient, Medieval, Art and Culture * 3',
        'Modern Indian History + Post Independence India * 3',
        'Science and Technology *3',
        'Indian Polity and Governance * 3',
        'Indian Society, Social Issues * 3',
        'World History * 3',
        'Essay * 3'
    ];

    for (let day = 0; day < 467; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);

        const dayOfWeek = currentDate.getDay(); // 0 = Sunday
        const week = Math.floor(day / 7) + 1;

        // Determine phase based on day
        let phase = 'Coaching Coverage Phase';
        let phaseColor = '#3498db';

        if (day >= 120 && day < 210) {
            phase = 'Coaching Completion Phase';
            phaseColor = '#9b59b6';
        } else if (day >= 210 && day < 330) {
            phase = 'Self Study Intensive';
            phaseColor = '#e67e22';
        } else if (day >= 330 && day < 420) {
            phase = 'Test Series Phase';
            phaseColor = '#e74c3c';
        } else if (day >= 420 && day < 450) {
            phase = 'Final Revision';
            phaseColor = '#f39c12';
        } else if (day >= 450) {
            phase = 'Mains Preparation';
            phaseColor = '#27ae60';
        }

        // **FIX: First day (September 21) should be Orientation**
        if (day === 0) {
            trackerData.push({
                date: currentDate.toISOString().split('T')[0],
                day: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
                sociology: 'Orientation',
                gs01: 'Orientation',
                gs02: 'Orientation',
                current_affairs: 'Orientation',
                notes: userNotes[day] || 'Coaching Program Orientation Day',
                phase: phase,
                phase_color: phaseColor
            });
            continue;
        }

        // Regular schedule starts from day 1 (September 22)
        // Sociology content
        let sociology = 'Live Class';
        if (dayOfWeek === 6) sociology = 'Revision';
        if (dayOfWeek === 0) sociology = 'Test and Practice';

        // GS1 subject (weekly rotation) - start from week 1
        const gs1Index = Math.floor((day - 1) / 7) % gs1Subjects.length;
        const gs1Subject = gs1Subjects[gs1Index];

        // GS2 content (weekends only)
        let gs2 = 'Revision + Tests and Practice';
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            const gs2Index = Math.floor((day - 1) / 14) % gs2Topics.length;
            gs2 = gs2Topics[gs2Index];
        }

        // Current Affairs theme - start from week 1
        const caIndex = Math.floor((day - 1) / 14) % caThemes.length;
        const currentAffairs = caThemes[caIndex];

        trackerData.push({
            date: currentDate.toISOString().split('T')[0],
            day: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
            sociology: sociology,
            gs01: gs1Subject,
            gs02: gs2,
            current_affairs: currentAffairs,
            notes: userNotes[day] || '',
            phase: phase,
            phase_color: phaseColor
        });
    }

    filteredData = [...trackerData];
    console.log(`Generated ${trackerData.length} days of study data with correct orientation day`);
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const actionButtons = document.querySelectorAll('.action-btn[data-section]');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });

    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });

    // Update sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.toggle('active', sec.id === section);
    });

    currentSection = section;

    // Initialize section-specific functionality
    if (section === 'tracker') {
        initializeTrackerPage();
    } else if (section === 'technical') {
        initializeTechnicalPage();
    } else if (section === 'schedule') {
        initializeSchedulePage();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

function initializeHomePage() {
    // Set current date
    const today = new Date();
    const currentDateEl = document.getElementById('current-date');
    if (currentDateEl) {
        currentDateEl.textContent = 
            today.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
    }

    // Calculate days to exams
    const daysToPrelims = Math.ceil((CONFIG.PRELIMS_DATE - today) / (1000 * 60 * 60 * 24));
    const daysToMains = Math.ceil((CONFIG.MAINS_DATE - today) / (1000 * 60 * 60 * 24));

    const daysToPrelimEl = document.getElementById('days-to-prelims');
    if (daysToPrelimEl) {
        daysToPrelimEl.textContent = daysToPrelims;
    }

    // Update current phase
    let currentPhase = 'Coaching Coverage Phase';
    if (daysToPrelims < 300) currentPhase = 'Coaching Completion Phase';
    if (daysToPrelims < 200) currentPhase = 'Self Study Intensive';
    if (daysToPrelims < 100) currentPhase = 'Test Series Phase';
    if (daysToPrelims < 30) currentPhase = 'Final Revision';

    const currentPhaseEl = document.getElementById('current-phase');
    if (currentPhaseEl) {
        currentPhaseEl.textContent = currentPhase;
    }
}

function initializeTrackerPage() {
    console.log('Initializing tracker page...');

    // Populate filter dropdowns
    populateFilters();

    // Render initial table
    applyFilters();

    // Update summary stats
    updateSummaryStats();
}

function populateFilters() {
    // Populate month filter
    const months = [...new Set(trackerData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }))];

    const monthFilter = document.getElementById('month-filter');
    if (monthFilter) {
        monthFilter.innerHTML = '<option value="">All Months</option>';
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = month;
            monthFilter.appendChild(option);
        });
    }
}

function applyFilters() {
    const monthFilter = document.getElementById('month-filter')?.value || '';
    const phaseFilter = document.getElementById('phase-filter')?.value || '';
    const searchInput = document.getElementById('search-input')?.value || '';

    filteredData = trackerData.filter(item => {
        const date = new Date(item.date);
        const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

        // Apply filters
        if (monthFilter && monthYear !== monthFilter) return false;
        if (phaseFilter && item.phase !== phaseFilter) return false;
        if (searchInput && !searchInItem(item, searchInput)) return false;

        return true;
    });

    currentPage = 1;
    renderTable();
    renderPagination();
}

function searchInItem(item, searchTerm) {
    const searchFields = [
        item.date, item.day, item.sociology, item.gs01,
        item.gs02, item.current_affairs, item.notes
    ];

    return searchFields.some(field => 
        field && field.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

function renderTable() {
    const tbody = document.getElementById('tracker-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const start = (currentPage - 1) * CONFIG.ROWS_PER_PAGE;
    const end = Math.min(start + CONFIG.ROWS_PER_PAGE, filteredData.length);

    for (let i = start; i < end; i++) {
        const item = filteredData[i];
        const row = createTableRow(item, start + i);
        tbody.appendChild(row);
    }
}

function createTableRow(item, index) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${formatDate(item.date)}</td>
        <td>${item.day}</td>
        <td>${item.sociology}</td>
        <td>${item.gs01}</td>
        <td>${item.gs02}</td>
        <td>${item.current_affairs}</td>
        <td class="notes-cell" onclick="openNotesModal(${index})">
            ${item.notes ? truncateText(item.notes, 50) : '<em>Click to add notes...</em>'}
        </td>
        <td><span class="phase-badge" style="background-color: ${item.phase_color}20; color: ${item.phase_color};">${item.phase}</span></td>
    `;

    return row;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredData.length / CONFIG.ROWS_PER_PAGE);

    // Previous button
    const prevBtn = createPaginationButton('← Previous', currentPage - 1, currentPage === 1);
    pagination.appendChild(prevBtn);

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPaginationButton(i.toString(), i, false, i === currentPage);
        pagination.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = createPaginationButton('Next →', currentPage + 1, currentPage === totalPages);
    pagination.appendChild(nextBtn);
}

function createPaginationButton(text, page, disabled = false, active = false) {
    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = disabled;
    if (active) button.classList.add('active');

    if (!disabled) {
        button.onclick = () => changePage(page);
    }

    return button;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / CONFIG.ROWS_PER_PAGE);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
        renderPagination();

        // Scroll to top of table
        document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateSummaryStats() {
    const totalDays = trackerData.length;
    const completedDays = Object.keys(userNotes).filter(key => userNotes[key].trim().length > 0).length;
    const completionPercentage = Math.round((completedDays / totalDays) * 100);

    // Update any summary elements if they exist
    console.log(`Progress: ${completedDays}/${totalDays} (${completionPercentage}%)`);
}

function openNotesModal(index) {
    const item = filteredData[index];
    if (!item) return;

    const modal = document.getElementById('notes-modal');
    const dateEl = document.getElementById('modal-date');
    const subjectsEl = document.getElementById('modal-subjects');
    const textareaEl = document.getElementById('notes-textarea');

    if (modal && dateEl && subjectsEl && textareaEl) {
        dateEl.textContent = `📅 ${formatDate(item.date)} - ${item.day}`;
        subjectsEl.textContent = `📚 ${item.sociology} | ${item.gs01} | ${item.gs02} | ${item.current_affairs}`;
        textareaEl.value = item.notes || '';

        modal.classList.add('show');
        modal.dataset.itemIndex = index;

        // Focus textarea
        setTimeout(() => textareaEl.focus(), 100);
    }
}

function closeNotesModal() {
    const modal = document.getElementById('notes-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function saveNotes() {
    const modal = document.getElementById('notes-modal');
    const textarea = document.getElementById('notes-textarea');
    const index = parseInt(modal.dataset.itemIndex);

    if (modal && textarea && !isNaN(index)) {
        const item = filteredData[index];
        const notes = textarea.value.trim();

        // Find the original index in trackerData
        const originalIndex = trackerData.findIndex(d => d.date === item.date);

        if (originalIndex !== -1) {
            // Update the data
            trackerData[originalIndex].notes = notes;
            filteredData[index].notes = notes;
            userNotes[originalIndex] = notes;

            // Save to localStorage
            saveUserData();

            // Refresh table
            renderTable();

            // Close modal
            closeNotesModal();

            showNotification('Notes saved successfully!', 'success');
        }
    }
}

function goToToday() {
    if (currentSection !== 'tracker') {
        switchSection('tracker');
    }

    const today = new Date().toISOString().split('T')[0];
    const todayIndex = filteredData.findIndex(item => item.date === today);

    if (todayIndex !== -1) {
        currentPage = Math.ceil((todayIndex + 1) / CONFIG.ROWS_PER_PAGE);
        renderTable();
        renderPagination();

        setTimeout(() => {
            const rows = document.querySelectorAll('#tracker-tbody tr');
            const rowIndex = todayIndex % CONFIG.ROWS_PER_PAGE;
            if (rows[rowIndex]) {
                rows[rowIndex].style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
                rows[rowIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    } else {
        showNotification('Today\'s entry not found in current view', 'info');
    }
}

function resetFilters() {
    const monthFilter = document.getElementById('month-filter');
    const phaseFilter = document.getElementById('phase-filter');
    const searchInput = document.getElementById('search-input');

    if (monthFilter) monthFilter.value = '';
    if (phaseFilter) phaseFilter.value = '';
    if (searchInput) searchInput.value = '';

    applyFilters();
}

function exportData() {
    const dataToExport = filteredData.filter(item => item.notes && item.notes.trim().length > 0);

    if (dataToExport.length === 0) {
        showNotification('No notes to export', 'info');
        return;
    }

    const csvContent = convertToCSV(dataToExport);
    downloadCSV(csvContent, 'upsc_study_notes.csv');

    showNotification(`Exported ${dataToExport.length} entries successfully!`, 'success');
}

function convertToCSV(data) {
    const headers = ['Date', 'Day', 'Sociology', 'GS1', 'GS2', 'Current Affairs', 'Notes', 'Phase'];
    const csvRows = [headers.join(',')];

    data.forEach(row => {
        const values = [
            row.date,
            row.day,
            row.sociology,
            row.gs01,
            row.gs02,
            row.current_affairs,
            `"${(row.notes || '').replace(/"/g, '""')}"`,
            row.phase
        ];
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
}

function initializeTechnicalPage() {
    console.log('Technical learning page initialized');
    // Any specific technical page initialization
}

function initializeSchedulePage() {
    console.log('Schedule page initialized with enhanced analysis');

    // Initialize milestone animations
    initializeMilestoneAnimations();

    // Initialize analysis interactions
    initializeAnalysisInteractions();
}

// Enhanced Analysis Features
function initializeAnalysisFeatures() {
    console.log('Initializing enhanced analysis features...');

    // Add smooth scrolling for analysis sections
    setupAnalysisNavigation();

    // Initialize interactive elements
    setupInteractiveElements();
}

function initializeMilestoneAnimations() {
    // Animate milestone markers when they come into view
    const milestoneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('milestone-visible');
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.milestone-item').forEach(item => {
        milestoneObserver.observe(item);
    });
}

function initializeAnalysisInteractions() {
    // Add hover effects for analysis cards
    document.querySelectorAll('.observation-item, .recommendation-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

function setupAnalysisNavigation() {
    // Add smooth scrolling between analysis sections
    const analysisLinks = document.querySelectorAll('[href^="#"]');
    analysisLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupInteractiveElements() {
    // Add interactive tooltips for technical terms
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = event.target.getAttribute('data-tooltip');

    document.body.appendChild(tooltip);

    const rect = event.target.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '0.9rem';
    tooltip.style.zIndex = '10000';
    tooltip.style.whiteSpace = 'nowrap';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function setupEventListeners() {
    // Filter controls
    const monthFilter = document.getElementById('month-filter');
    const phaseFilter = document.getElementById('phase-filter');
    const searchInput = document.getElementById('search-input');

    if (monthFilter) monthFilter.addEventListener('change', applyFilters);
    if (phaseFilter) phaseFilter.addEventListener('change', applyFilters);
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }

    // Action buttons
    const todayBtn = document.getElementById('today-btn');
    const resetBtn = document.getElementById('reset-btn');
    const exportBtn = document.getElementById('export-btn');

    if (todayBtn) todayBtn.addEventListener('click', goToToday);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (exportBtn) exportBtn.addEventListener('click', exportData);

    // Modal controls
    const modal = document.getElementById('notes-modal');
    const closeModalBtn = document.querySelector('.modal-close');
    const saveNotesBtn = document.getElementById('save-notes');
    const cancelNotesBtn = document.getElementById('cancel-notes');

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeNotesModal);
    if (saveNotesBtn) saveNotesBtn.addEventListener('click', saveNotes);
    if (cancelNotesBtn) cancelNotesBtn.addEventListener('click', closeNotesModal);

    // Close modal on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeNotesModal();
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeNotesModal();
        }

        if (e.ctrlKey && e.key === 's' && modal && modal.classList.contains('show')) {
            e.preventDefault();
            saveNotes();
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const colors = {
        success: '#059669',
        error: '#dc2626',
        warning: '#d97706',
        info: '#0891b2'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make functions globally accessible
window.openNotesModal = openNotesModal;
window.goToToday = goToToday;
window.switchSection = switchSection;

// Add notification animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.phase-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.notes-cell {
    cursor: pointer;
    padding: 12px;
    transition: background-color 0.2s ease;
}

.notes-cell:hover {
    background-color: rgba(37, 99, 235, 0.05);
}

.notes-cell em {
    color: #9ca3af;
    font-style: italic;
}

.milestone-visible {
    animation: milestoneAppear 0.6s ease-out;
}

@keyframes milestoneAppear {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.tooltip {
    transition: opacity 0.2s ease;
}

.analysis-section {
    scroll-margin-top: 80px;
}
`;
document.head.appendChild(style);
