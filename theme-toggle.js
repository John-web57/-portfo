const themeToggle = document.querySelector('#theme-toggle');

function setTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
}

document.addEventListener('DOMContentLoaded', initTheme);