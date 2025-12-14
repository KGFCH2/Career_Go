// 🌓 Theme toggle functionality for Career Go
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // 💾 Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', function (e) {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // ✨ Magical click effect with scaling and rotation
        themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
        themeToggle.style.filter = 'brightness(1.5) blur(1px)';

        // 🎆 Create magical particles effect
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = currentTheme === 'dark' ? '#ffd700' : '#2b6cb0'; // 🟡 Gold or 🔵 Blue
            particle.style.borderRadius = '50%';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.animation = `particle${i % 2} 1s ease-out forwards`;
            particle.style.pointerEvents = 'none';

            themeToggle.appendChild(particle);

            setTimeout(() => particle.remove(), 1000); // 🧹 Clean up particles
        }

        setTimeout(() => {
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme); // 💾 Save theme preference

            // 🌟 Enhanced visual feedback
            themeToggle.style.transform = 'scale(1.2) rotate(360deg)';
            themeToggle.style.filter = 'brightness(1.8) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))';

            setTimeout(() => {
                themeToggle.style.transform = '';
                themeToggle.style.filter = '';
            }, 600);
        }, 200);
    });

    // Set active nav link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});