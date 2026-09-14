// Theme Toggle System (Syncs across desktop and mobile drawers)
function updateThemeButtons(theme) {
    const buttons = document.querySelectorAll('.theme-toggle-btn, #theme-toggle');
    buttons.forEach(btn => {
        btn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
        btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    });
}

function setTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);
    localStorage.setItem('theme', theme);
    updateThemeButtons(theme);
}

function toggleTheme() {
    const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    document.addEventListener('click', (e) => {
        if (e.target.closest('.theme-toggle-btn') || e.target.closest('#theme-toggle')) {
            toggleTheme();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}