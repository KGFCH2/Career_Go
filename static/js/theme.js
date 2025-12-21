// Crazy Theme Toggle with 3D Effects and Particle Animations
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    }

    // Create particle explosion effect
    function createParticleExplosion(x, y) {
        const particles = 20;
        const colors = body.getAttribute('data-theme') === 'dark'
            ? ['#ffd700', '#ff6b35', '#f72585', '#4361ee', '#7209b7']
            : ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#ff6b35'];

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'theme-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
            `;

            document.body.appendChild(particle);

            const angle = (Math.PI * 2 * i) / particles;
            const velocity = Math.random() * 100 + 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.animate([
                {
                    transform: `translate(0, 0) scale(1)`,
                    opacity: 1
                },
                {
                    transform: `translate(${tx}px, ${ty}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    // Create ripple effect
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'theme-ripple';
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid currentColor;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
        `;

        document.body.appendChild(ripple);

        ripple.animate([
            {
                width: '10px',
                height: '10px',
                opacity: 1
            },
            {
                width: '200px',
                height: '200px',
                opacity: 0
            }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    }

    themeToggle.addEventListener('click', function (e) {
        const rect = themeToggle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Create visual effects
        createRipple(x, y);
        createParticleExplosion(x, y);

        // Animate button with crazy 3D flip
        themeToggle.style.transform = 'rotateY(360deg) scale(1.2)';
        themeToggle.style.filter = 'brightness(1.5) saturate(2)';

        setTimeout(() => {
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Reset button animation
            setTimeout(() => {
                themeToggle.style.transform = '';
                themeToggle.style.filter = '';
            }, 300);
        }, 150);
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