// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeProfile();
    initializeCategories();
    initializeDropdowns();
    initializeTabSwitching();
    initializeContactMethodToggle();
    initializeFormHandling();
    initializeGoogleSignIn();
    initializeLanguageSelector();
    initializeViewModeSelector();
    initializeDashboardNavigation();
    initializeUserProfileDropdown();
    initializeSearchFunctionality();
    initializeCategoryCardsInteraction();
    initializeDashboardSidebarToggle();
    initializeSidebarNavigation();
    initializeUserProfile();
    initializeMenuFunctionality();
    initializeLoadSectionContent();
    initializeValidationHelpers();
    initializeErrorHandling();
    initializeSuccessHandling();
    initializeSimulateAuth();
    initializeVoiceSearchFunctionality();
    initializeImageSearchFunctionality();
    initializeLoginLogoutFunctionality();
});

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const voiceSearchBtn = document.querySelector('.voice-search-btn');
    const imageSearchBtn = document.querySelector('.image-search-btn');
    const imageInput = document.getElementById('imageInput');

    // Regular search
    searchInput.addEventListener('input', function(e) {
        // Implement search functionality here
        console.log('Searching for:', e.target.value);
    });

    // Voice search
    if (voiceSearchBtn) {
        voiceSearchBtn.addEventListener('click', function() {
            if ('webkitSpeechRecognition' in window) {
                const recognition = new webkitSpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;

                recognition.onstart = () => {
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    searchInput.value = transcript;
                    // Trigger search with transcript
                    console.log('Voice search:', transcript);
                };

                recognition.onend = () => {
                    this.innerHTML = '<i class="fas fa-microphone"></i>';
                };

                recognition.start();
            } else {
                alert('Voice search is not supported in your browser');
            }
        });
    }

    // Image search
    if (imageSearchBtn && imageInput) {
        imageSearchBtn.addEventListener('click', () => imageInput.click());
        
        imageInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                // Here you would implement image search
                console.log('Image search with:', file.name);
                // Reset input for future uploads
                this.value = '';
            }
        });
    }
}

// Profile Functionality
function initializeProfile() {
    const userProfile = document.querySelector('.user-profile');
    const profileTrigger = document.querySelector('.profile-trigger');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const username = document.querySelector('.username');
    const logoutLink = document.querySelector('.logout');

    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    updateProfileUI(isLoggedIn);

    // Toggle profile dropdown
    if (profileTrigger) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (profileDropdown && !userProfile.contains(e.target)) {
            profileDropdown.style.display = 'none';
        }
    });

    // Handle logout
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    function updateProfileUI(isLoggedIn) {
        if (username) {
            username.textContent = isLoggedIn ? localStorage.getItem('username') || 'User' : 'Guest';
        }
    }

    function handleLogout() {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('username');
        updateProfileUI(false);
        profileDropdown.style.display = 'none';
        window.location.href = 'index.html';
    }
}

// Categories Functionality
function initializeCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            // Here you would implement category navigation
            console.log('Selected category:', category);
        });
    });
}

// Dropdown Functionality
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (trigger && content) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                content.classList.toggle('show');
            });
        }
    });

    // Close all dropdowns when clicking outside
    document.addEventListener('click', () => {
        const openDropdowns = document.querySelectorAll('.dropdown-content.show');
        openDropdowns.forEach(dropdown => dropdown.classList.remove('show'));
    });
}

// Tab Switching
function initializeTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${targetTab}Form`).classList.add('active');
        });
    });
}

// Contact Method Toggle
function initializeContactMethodToggle() {
    const contactMethodRadios = document.querySelectorAll('input[name="contactMethod"]');
    const emailGroup = document.querySelector('.email-group');
    const mobileGroup = document.querySelector('.mobile-group');

    contactMethodRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'email') {
                emailGroup.style.display = 'block';
                mobileGroup.style.display = 'none';
                document.getElementById('signupEmail').required = true;
                document.getElementById('signupMobile').required = false;
            } else {
                emailGroup.style.display = 'none';
                mobileGroup.style.display = 'block';
                document.getElementById('signupEmail').required = false;
                document.getElementById('signupMobile').required = true;
            }
        });
    });
}

// Form Handling
function initializeFormHandling() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    // Toggle password visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            btn.classList.toggle('fa-eye');
            btn.classList.toggle('fa-eye-slash');
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const identifier = document.getElementById('loginIdentifier').value;
        const password = document.getElementById('loginPassword').value;
        
        // Here you would typically validate credentials with a backend
        // For now, we'll just redirect to home page
        window.location.href = 'home.html';
    });

    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const contactMethod = document.querySelector('input[name="contactMethod"]:checked').value;
        const email = document.getElementById('signupEmail').value.trim();
        const mobile = document.getElementById('signupMobile').value.trim();
        const password = document.getElementById('signupPassword').value;
        
        if (contactMethod === 'email') {
            if (!isValidEmail(email)) {
                showError(document.getElementById('signupEmail'), 
                         'Please enter a valid email address');
                return;
            }
        } else {
            if (!isValidMobile(mobile)) {
                showError(document.getElementById('signupMobile'), 
                         'Please enter a valid mobile number');
                return;
            }
        }
        
        if (password.length < 8) {
            showError(document.getElementById('signupPassword'), 
                     'Password must be at least 8 characters long');
            return;
        }
        
        // Here you would typically make an API call to your backend
        const userData = {
            contactMethod,
            email: contactMethod === 'email' ? email : '',
            mobile: contactMethod === 'mobile' ? mobile : '',
            password
        };
        
        console.log('Signup form submitted:', userData);
        showSuccess(signupForm, 'Creating your account...');
        
        // Simulate API call
        simulateAuth(signupForm, 'Account created successfully!');
    });
}

// Google Sign In
function initializeGoogleSignIn() {
    const googleBtn = document.querySelector('.google-btn');
    googleBtn.addEventListener('click', () => {
        console.log('Google sign-in initiated');
        showSuccess(document.querySelector('.auth-form.active'), 'Connecting to Google...');
        // Here you would typically initiate Google OAuth flow
    });
}

// Language Selector
function initializeLanguageSelector() {
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageLinks = languageDropdown.querySelectorAll('a');

    // Toggle dropdown
    languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        languageDropdown.classList.remove('show');
    });

    // Prevent dropdown from closing when clicking inside it
    languageDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Handle language selection
    languageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.dataset.lang;
            const currentLang = document.documentElement.lang;
            
            if (lang !== currentLang) {
                // Here you would typically:
                // 1. Save the language preference
                localStorage.setItem('preferredLanguage', lang);
                
                // 2. Update the UI language
                document.documentElement.lang = lang;
                
                // 3. Update the button text
                const langText = e.target.textContent;
                languageBtn.querySelector('span').textContent = langText;
                
                // 4. Close the dropdown
                languageDropdown.classList.remove('show');
                
                // 5. Refresh the page or update content
                // For now, we'll just show an alert
                alert(`Language changed to ${langText}`);
            }
        });
    });
}

// View Mode Selector
function initializeViewModeSelector() {
    const viewModeBtn = document.getElementById('viewModeBtn');
    const viewModeDropdown = document.getElementById('viewModeDropdown');
    const viewModeLinks = viewModeDropdown.querySelectorAll('a');

    // Toggle dropdown
    viewModeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        viewModeDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        viewModeDropdown.classList.remove('show');
    });

    // Prevent dropdown from closing when clicking inside it
    viewModeDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Handle view mode selection
    viewModeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewMode = e.target.closest('a').dataset.view;
            
            // Update the UI
            if (viewMode === 'mobile') {
                document.body.classList.add('mobile-view');
                viewModeBtn.innerHTML = '<i class="fas fa-mobile-alt"></i><span>Mobile View</span>';
            } else {
                document.body.classList.remove('mobile-view');
                viewModeBtn.innerHTML = '<i class="fas fa-desktop"></i><span>Desktop View</span>';
            }
            
            // Save preference
            localStorage.setItem('preferredView', viewMode);
            
            // Close dropdown
            viewModeDropdown.classList.remove('show');
        });
    });

    // Set initial view mode from saved preference
    const savedViewMode = localStorage.getItem('preferredView');
    if (savedViewMode === 'mobile') {
        document.body.classList.add('mobile-view');
        viewModeBtn.innerHTML = '<i class="fas fa-mobile-alt"></i><span>Mobile View</span>';
    }
}

// Dashboard Navigation
function initializeDashboardNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all links
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Here you would typically handle navigation/content loading
            const target = this.getAttribute('href').substring(1);
            console.log('Navigating to:', target);
        });
    });
}

// User Profile Dropdown
function initializeUserProfileDropdown() {
    const userProfile = document.querySelector('.user-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userProfile.contains(e.target)) {
            profileDropdown.style.display = 'none';
        }
    });

    // Toggle dropdown on profile click
    userProfile.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = profileDropdown.style.display === 'block';
        profileDropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Handle profile menu items
    profileDropdown.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const action = e.target.getAttribute('href').substring(1);
            
            switch(action) {
                case 'profile':
                    console.log('Navigate to profile page');
                    break;
                case 'settings':
                    console.log('Open settings');
                    break;
                case 'logout':
                    console.log('Perform logout');
                    // Here you would typically handle the logout process
                    break;
            }
        }
    });
}

// Search Functionality
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.trim().toLowerCase();
        // Here you would typically implement search functionality
        console.log('Searching for:', searchTerm);
    });
}

// Category Cards Interaction
function initializeCategoryCardsInteraction() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            console.log('Selected category:', category);
            // Here you would typically handle category selection
        });
    });
}

// Dashboard Sidebar Toggle
function initializeDashboardSidebarToggle() {
    const menuTrigger = document.querySelector('.menu-trigger');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    let sidebarVisible = false;

    // Show sidebar when mouse enters the left edge of the screen
    document.addEventListener('mousemove', function(e) {
        if (e.clientX <= 10 && !sidebarVisible) {
            dashboardSidebar.classList.add('active');
            sidebarVisible = true;
        }
    });

    // Hide sidebar when mouse leaves it
    dashboardSidebar.addEventListener('mouseleave', function() {
        dashboardSidebar.classList.remove('active');
        sidebarVisible = false;
    });

    // Manual toggle with menu button
    menuTrigger.addEventListener('click', function() {
        sidebarVisible = !sidebarVisible;
        dashboardSidebar.classList.toggle('active');
    });
}

// Sidebar Navigation
function initializeSidebarNavigation() {
    const dashboardNavLinks = document.querySelectorAll('.dashboard-sidebar-nav a');
    dashboardNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            dashboardNavLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            const target = this.getAttribute('href').substring(1);
            console.log('Navigating to:', target);
        });
    });
}

// User Profile
function initializeUserProfile() {
    const dashboardUserProfile = document.querySelector('.dashboard-user-profile');
    const dashboardProfileDropdown = document.querySelector('.dashboard-profile-dropdown');
    const saveProfileBtn = document.querySelector('.save-profile');

    // Load saved profile data
    loadProfileData();

    // Save profile data
    saveProfileBtn.addEventListener('click', function() {
        const profileData = {
            fullName: document.getElementById('fullName').value,
            username: document.getElementById('username').value,
            mobile: document.getElementById('mobile').value,
            email: document.getElementById('email').value
        };

        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        
        // Update display name
        const usernameDisplay = document.querySelector('.username');
        usernameDisplay.textContent = profileData.fullName || profileData.username;

        // Show success message
        alert('Profile updated successfully!');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dashboardUserProfile.contains(e.target)) {
            dashboardProfileDropdown.style.display = 'none';
        }
    });

    // Toggle dropdown on profile click
    dashboardUserProfile.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = dashboardProfileDropdown.style.display === 'block';
        dashboardProfileDropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Handle profile menu items
    dashboardProfileDropdown.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const action = e.target.getAttribute('href').substring(1);
            
            switch(action) {
                case 'settings':
                    console.log('Open settings');
                    break;
                case 'logout':
                    console.log('Perform logout');
                    localStorage.removeItem('userProfile');
                    window.location.reload();
                    break;
            }
        }
    });

    // Category cards interaction
    const dashboardCategoryCards = document.querySelectorAll('.dashboard-category-card');
    dashboardCategoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            console.log('Selected category:', category);
        });
    });

    // Menu functionality
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Hide all sections except the first one initially
    contentSections.forEach((section, index) => {
        if (index !== 0) section.style.display = 'none';
    });

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            
            // Hide all sections
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the target section
            document.getElementById(targetId).style.display = 'block';
            
            // Load content based on the section
            loadSectionContent(targetId);
        });
    });

    // Function to load content for each section
    function loadSectionContent(sectionId) {
        switch(sectionId) {
            case 'updated-products':
                loadProducts();
                break;
            case 'payment-history':
                loadPaymentHistory();
                break;
            case 'customer-reviews':
                loadCustomerReviews();
                break;
        }
    }

    // Load products data
    function loadProducts() {
        const productsGrid = document.querySelector('.products-grid');
        // Sample products data - replace with actual API call
        const products = [
            { name: 'Product 1', price: '$99.99', image: 'product1.jpg' },
            { name: 'Product 2', price: '$149.99', image: 'product2.jpg' },
            { name: 'Product 3', price: '$199.99', image: 'product3.jpg' }
        ];
        
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='placeholder.jpg'">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
            </div>
        `).join('');
    }

    // Load payment history
    function loadPaymentHistory() {
        const paymentList = document.querySelector('.payment-list');
        // Sample payment data - replace with actual API call
        const payments = [
            { date: '2024-02-12', amount: '$99.99', status: 'Completed' },
            { date: '2024-02-10', amount: '$149.99', status: 'Completed' },
            { date: '2024-02-08', amount: '$199.99', status: 'Pending' }
        ];
        
        paymentList.innerHTML = payments.map(payment => `
            <div class="payment-card">
                <p class="date">${payment.date}</p>
                <p class="amount">${payment.amount}</p>
                <p class="status ${payment.status.toLowerCase()}">${payment.status}</p>
            </div>
        `).join('');
    }

    // Load customer reviews
    function loadCustomerReviews() {
        const reviewsContainer = document.querySelector('.reviews-container');
        // Sample reviews data - replace with actual API call
        const reviews = [
            { user: 'John D.', rating: 5, comment: 'Excellent service!' },
            { user: 'Sarah M.', rating: 4, comment: 'Great products, fast delivery' },
            { user: 'Mike R.', rating: 5, comment: 'Very satisfied with my purchase' }
        ];
        
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-card">
                <h4>${review.user}</h4>
                <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                <p>${review.comment}</p>
            </div>
        `).join('');
    }

    // Load initial content
    loadSectionContent('updated-products');

    // Helper function to load profile data
    function loadProfileData() {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const profileData = JSON.parse(savedProfile);
            document.getElementById('fullName').value = profileData.fullName || '';
            document.getElementById('username').value = profileData.username || '';
            document.getElementById('mobile').value = profileData.mobile || '';
            document.getElementById('email').value = profileData.email || '';

            // Update display name
            const usernameDisplay = document.querySelector('.username');
            usernameDisplay.textContent = profileData.fullName || profileData.username;
        }
    }
}

// Validation Helpers
function initializeValidationHelpers() {
    function isValidIdentifier(value) {
        return isValidEmail(value) || isValidMobile(value);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidMobile(mobile) {
        // Supports formats: +1234567890, 1234567890, 123-456-7890
        const mobileRegex = /^(\+\d{1,3}[-.]?)?\d{10}$/;
        return mobileRegex.test(mobile.replace(/[-\s]/g, ''));
    }
}

// Error Handling
function initializeErrorHandling() {
    function showError(input, message) {
        const formGroup = input.closest('.input-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.textContent = message;
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }
        
        input.classList.add('error');
        
        // Remove error after 3 seconds
        setTimeout(() => {
            const errorDiv = formGroup.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.remove();
            }
            input.classList.remove('error');
        }, 3000);
    }
}

// Success Handling
function initializeSuccessHandling() {
    function showSuccess(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const existingSuccess = form.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        form.appendChild(successDiv);
    }
}

// Simulate Auth
function initializeSimulateAuth() {
    function simulateAuth(form, successMessage) {
        // Simulate API delay
        setTimeout(() => {
            const successDiv = form.querySelector('.success-message');
            if (successDiv) {
                successDiv.textContent = successMessage;
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    form.reset();
                    successDiv.remove();
                }, 2000);
            }
        }, 1500);
    }
}

// Voice Search Functionality
function initializeVoiceSearchFunctionality() {
    document.querySelector('.voice-search-btn').addEventListener('click', function() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('searchInput').value = transcript;
            };

            recognition.onend = () => {
                this.innerHTML = '<i class="fas fa-microphone"></i>';
            };

            recognition.start();
        } else {
            alert('Voice search is not supported in your browser');
        }
    });
}

// Image Search Functionality
function initializeImageSearchFunctionality() {
    document.querySelector('.image-search-btn').addEventListener('click', function() {
        document.getElementById('imageInput').click();
    });

    document.getElementById('imageInput').addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Here you would typically upload the image to your server
            // For now, we'll just show a message
            alert('Image uploaded: ' + file.name);
        }
    });
}

// Login/Logout Functionality
function initializeLoginLogoutFunctionality() {
    const loginForm = document.getElementById('loginForm');
    const userProfile = document.querySelector('.user-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const username = document.querySelector('.username');
    const logoutLink = document.querySelector('.logout');

    // Check login state
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    updateProfileUI(isLoggedIn);

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;

            // Simple validation
            if (usernameInput && passwordInput) {
                // In a real app, you would validate with a backend server
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', usernameInput);
                window.location.href = 'index.html';
            } else {
                alert('Please enter both username and password');
            }
        });
    }

    // Handle logout
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // Update profile UI based on login state
    function updateProfileUI(isLoggedIn) {
        if (username) {
            username.textContent = isLoggedIn ? localStorage.getItem('username') || 'User' : 'Guest';
        }
    }

    // Handle logout action
    function handleLogout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }

    // Redirect to login if not logged in (except for login page)
    if (!isLoggedIn && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    }
}
