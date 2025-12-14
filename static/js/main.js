// 🎯 Main JavaScript functionality for Career Go
document.addEventListener('DOMContentLoaded', function () {
    // 👤 Profile menu toggle functionality
    const profileBtn = document.getElementById('profile-btn');
    const profileMenu = document.getElementById('profile-menu');

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', function () {
            // 🏗️ Lazy-populate the menu items only when the user clicks Profile
            if (profileMenu.children.length === 0) {
                const view = document.createElement('a');
                view.href = '/profile';
                view.className = 'profile-menu-item';
                view.textContent = 'View Profile';

                const out = document.createElement('a');
                out.href = '#';
                out.className = 'profile-menu-item';
                out.textContent = 'Logout';
                out.addEventListener('click', function (e) { e.preventDefault(); logout(); });

                profileMenu.appendChild(view);
                profileMenu.appendChild(out);
            }

            const isHidden = profileMenu.classList.toggle('hidden');
            profileBtn.setAttribute('aria-expanded', String(!isHidden));
            profileMenu.setAttribute('aria-hidden', String(isHidden));
        });

        // 🖱️ Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.nav-profile')) {
                profileMenu.classList.add('hidden');
            }
        });
    }

    // 👁️ Password toggle functionality (show/hide password)
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    });

    // 🔐 Show login prompt for unauthenticated users
    window.showLoginPrompt = function () {
        const floatMsg = document.getElementById('auth-float-fixed');
        if (!floatMsg) return;

        const card = floatMsg.querySelector('.auth-float-message');
        card.style.transition = 'transform 180ms ease-out, opacity 180ms';
        card.style.transform = 'translateY(-8px)';
        card.style.opacity = '1';
        setTimeout(() => { card.style.transform = ''; }, 220);

        // temporary highlight
        card.classList.add('pulse');
        setTimeout(() => card.classList.remove('pulse'), 600);
    };

    // Utility functions
    function showLoading(button) {
        button.disabled = true;
        button.classList.add('btn-loading');
        button.dataset.originalText = button.textContent;
        button.textContent = 'Loading...';
    }

    function hideLoading(button) {
        button.disabled = false;
        button.classList.remove('btn-loading');
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    }

    function showError(element, message) {
        const formGroup = element.closest('.form-group');
        formGroup.classList.add('error');
        let errorMsg = formGroup.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            formGroup.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    function clearErrors(form) {
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            const errorMsg = group.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
    }

    // Enhanced form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            clearErrors(this);

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const gender = document.getElementById('gender') ? document.getElementById('gender').value : '';
            const submitBtn = this.querySelector('button[type="submit"]');

            let hasError = false;

            if (!email) {
                showError(document.getElementById('email'), 'Email is required');
                hasError = true;
            } else if (!validateEmail(email)) {
                showError(document.getElementById('email'), 'Please enter a valid email');
                hasError = true;
            }

            if (!password) {
                showError(document.getElementById('password'), 'Password is required');
                hasError = true;
            }

            if (hasError) return;

            showLoading(submitBtn);

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, gender })
                });
                const data = await response.json();
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = data.message;
                messageDiv.style.color = response.ok ? 'var(--secondary-color)' : 'var(--accent-color)';
                if (response.ok) {
                    setTimeout(() => window.location.href = '/dashboard', 1000);
                }
            } catch (error) {
                console.error('Login error:', error);
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = 'Network error. Please try again.';
                messageDiv.style.color = 'var(--accent-color)';
            } finally {
                hideLoading(submitBtn);
            }
        });
    }

    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            clearErrors(this);

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const gender = document.getElementById('gender') ? document.getElementById('gender').value : 'unspecified';
            const submitBtn = this.querySelector('button[type="submit"]');

            let hasError = false;

            if (!name) {
                showError(document.getElementById('name'), 'Name is required');
                hasError = true;
            }

            if (!email) {
                showError(document.getElementById('email'), 'Email is required');
                hasError = true;
            } else if (!validateEmail(email)) {
                showError(document.getElementById('email'), 'Please enter a valid email');
                hasError = true;
            }

            if (!password) {
                showError(document.getElementById('password'), 'Password is required');
                hasError = true;
            } else if (!validatePassword(password)) {
                showError(document.getElementById('password'), 'Password must be at least 8 characters');
                hasError = true;
            }

            if (hasError) return;

            showLoading(submitBtn);

            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, gender })
                });
                const data = await response.json();
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = data.message;
                messageDiv.style.color = response.ok ? 'var(--secondary-color)' : 'var(--accent-color)';
                if (response.ok) {
                    setTimeout(() => window.location.href = '/login', 1000);
                }
            } catch (error) {
                console.error('Signup error:', error);
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = 'Network error. Please try again.';
                messageDiv.style.color = 'var(--accent-color)';
            } finally {
                hideLoading(submitBtn);
            }
        });
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;

            try {
                const response = await fetch('/api/forgot-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await response.json();
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = data.message;
                messageDiv.style.color = response.ok ? 'green' : 'red';
                if (response.ok) {
                    document.getElementById('forgot-form').style.display = 'none';
                    document.getElementById('reset-form').style.display = 'block';
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                document.getElementById('message').textContent = 'Error sending reset code. Please try again.';
                document.getElementById('message').style.color = 'red';
            }
        });
    }

    // Reset password form
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const code = document.getElementById('code').value;
            const newPassword = document.getElementById('new-password').value;

            try {
                const response = await fetch('/api/reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, code, new_password: newPassword })
                });
                const data = await response.json();
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = data.message;
                messageDiv.style.color = response.ok ? 'green' : 'red';
                if (response.ok) {
                    setTimeout(() => window.location.href = '/login', 1000);
                }
            } catch (error) {
                console.error('Reset password error:', error);
            }
        });
    }

    // Skill suggestion form
    const skillForm = document.getElementById('skill-form');
    if (skillForm) {
        skillForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const skillsInput = document.getElementById('skills-input').value;
            const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);

            if (skills.length === 0) {
                alert('Please enter at least one skill.');
                return;
            }

            try {
                const response = await fetch('/api/suggest_careers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ skills })
                });
                const data = await response.json();

                const recommendationsDiv = document.getElementById('recommendations');
                recommendationsDiv.innerHTML = '<h2>Your Career Recommendations</h2>';

                data.recommendations.forEach(rec => {
                    const card = document.createElement('div');
                    card.className = 'recommendation-card';
                    card.innerHTML = `
                        <h3>${rec.career}</h3>
                        <p><strong>Score:</strong> ${rec.score}</p>
                        <p><strong>Top Skills:</strong> ${rec.top_skills.join(', ')}</p>
                        <a href="${rec.learn_link}" target="_blank" class="learn-link">Learn More</a>
                    `;
                    recommendationsDiv.appendChild(card);
                });
            } catch (error) {
                console.error('Suggestion error:', error);
            }
        });
    }

    // Chat functionality
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const messageInput = document.getElementById('message-input');
            const message = messageInput.value.trim();

            if (!message) return;

            // Add user message
            addMessage(message, 'user');
            messageInput.value = '';

            // Show typing indicator
            const typingId = showTypingIndicator();

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });

                // Remove typing indicator
                removeTypingIndicator(typingId);

                const data = await response.json();
                addMessage(data.reply, 'bot', data.source);
            } catch (error) {
                console.error('Chat error:', error);
                removeTypingIndicator(typingId);
                addMessage('Sorry, there was an error processing your message.', 'bot');
            }
        });
    }

    function showTypingIndicator() {
        const messagesDiv = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        const id = 'typing-' + Date.now();
        typingDiv.id = id;
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dots"><span>.</span><span>.</span><span>.</span></div>';
        messagesDiv.appendChild(typingDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }

    // Suggestion buttons functionality
    function sendSuggestion(message) {
        const messageInput = document.getElementById('message-input');
        messageInput.value = message;

        // Auto-submit the form
        const chatForm = document.getElementById('chat-form');
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        chatForm.dispatchEvent(submitEvent);
    }

    // Make sendSuggestion globally available
    window.sendSuggestion = sendSuggestion;

    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    suggestionButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const message = this.getAttribute('data-message');
            const messageInput = document.getElementById('message-input');

            // Fill the input with the suggestion
            messageInput.value = message;

            // Auto-submit the form
            const chatForm = document.getElementById('chat-form');
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            chatForm.dispatchEvent(submitEvent);
        });
    });

    // Nudge unauthenticated users to login when they click inside the chat area
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        chatContainer.addEventListener('click', function (e) {
            if (document.getElementById('auth-float-fixed')) {
                window.showLoginPrompt();
            }
        });
    }

    function addMessage(text, type, source = null) {
        const messagesDiv = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.style.whiteSpace = 'pre-wrap';

        if (type === 'bot') {
            messageDiv.appendChild(contentDiv);
            messagesDiv.appendChild(messageDiv);

            let i = 0;
            const speed = 15;
            let isUserScrolling = false;

            function typeWriter() {
                if (i < text.length) {
                    contentDiv.textContent += text.charAt(i);
                    i++;

                    // Only auto-scroll if user hasn't manually scrolled up
                    if (!isUserScrolling && messagesDiv.scrollHeight - messagesDiv.scrollTop - messagesDiv.clientHeight < 50) {
                        messagesDiv.scrollTop = messagesDiv.scrollHeight;
                    }

                    setTimeout(typeWriter, speed);
                } else {
                    // Simple markdown parsing after typing
                    contentDiv.innerHTML = text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>');
                }
            }

            // Detect if user is manually scrolling
            messagesDiv.addEventListener('wheel', function handler() {
                isUserScrolling = true;
                setTimeout(() => { isUserScrolling = false; }, 2000); // Reset after 2 seconds of no scrolling
            }, { once: false });

            typeWriter();
        } else {
            contentDiv.textContent = text;
            messageDiv.appendChild(contentDiv);
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }

    // Scroll animation functionality
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }

    // Trigger scroll animations on load and scroll
    window.addEventListener('scroll', handleScrollAnimations);
    window.addEventListener('load', handleScrollAnimations);

    // Image Slider Functionality
    function initImageSlider() {
        const slider = document.querySelector('.image-slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.slide');
        let currentSlide = 0;
        const slideInterval = 1500; // 1.5 seconds per slide (faster)

        function showSlide(index) {
            // Remove active class from all slides
            slides.forEach(slide => slide.classList.remove('active'));

            // Add active class to current slide
            slides[index].classList.add('active');

            currentSlide = index;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Start automatic sliding (use a mutable timer reference so we can clear/restart safely)
        let slideTimer = setInterval(nextSlide, slideInterval);

        // Pause on hover
        slider.addEventListener('mouseenter', () => {
            if (slideTimer) clearInterval(slideTimer);
            slideTimer = null;
        });

        // Resume on mouse leave
        slider.addEventListener('mouseleave', () => {
            if (!slideTimer) slideTimer = setInterval(nextSlide, slideInterval);
        });

        // Add click navigation (optional)
        slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // Show first slide initially
        showSlide(0);
    }

    // Initialize image slider
    initImageSlider();
});

// Logout function
function logout() {
    fetch('/api/logout', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            window.location.href = '/';
        });
}