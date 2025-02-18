// Theme and Mode Manager

// Get stored preferences or set defaults
let currentTheme = localStorage.getItem('theme') || 'light';
let currentMode = localStorage.getItem('viewMode') || 'desktop';

// Function to update theme
function updateTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle button if it exists
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Function to toggle theme
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
}

// Function to update view mode
function updateViewMode(mode) {
    currentMode = mode;
    localStorage.setItem('viewMode', mode);
    document.documentElement.setAttribute('data-mode', mode);
    
    // Update mode toggle button if it exists
    const modeIcon = document.getElementById('modeIcon');
    if (modeIcon) {
        modeIcon.className = mode === 'mobile' ? 'fas fa-desktop' : 'fas fa-mobile-alt';
    }
}

// Function to toggle view mode
function toggleViewMode() {
    const newMode = currentMode === 'desktop' ? 'mobile' : 'desktop';
    updateViewMode(newMode);
}

// Initialize theme and mode on page load
document.addEventListener('DOMContentLoaded', () => {
    updateTheme(currentTheme);
    updateViewMode(currentMode);
});
