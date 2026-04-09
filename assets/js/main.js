const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const yearTarget = document.querySelector('#year');
const themeStorageKey = 'arotech-theme';

const getPreferredTheme = () => {
    const storedTheme = window.localStorage.getItem(themeStorageKey);

    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
    document.body.dataset.theme = theme;
};

const updateThemeToggle = (toggleButton, theme) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const label = nextTheme === 'dark' ? 'Dark mode' : 'Light mode';
    const icon = nextTheme === 'dark' ? 'D' : 'L';

    toggleButton.setAttribute('aria-label', `Switch to ${label.toLowerCase()}`);
    toggleButton.setAttribute('title', `Switch to ${label.toLowerCase()}`);
    toggleButton.setAttribute('data-theme-target', nextTheme);

    const iconTarget = toggleButton.querySelector('.theme-toggle-icon');
    const textTarget = toggleButton.querySelector('.theme-toggle-text');

    if (iconTarget) {
        iconTarget.textContent = icon;
    }

    if (textTarget) {
        textTarget.textContent = label;
    }
};

const createThemeToggle = () => {
    const toggleButton = document.createElement('button');

    toggleButton.type = 'button';
    toggleButton.className = 'theme-toggle';
    toggleButton.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true"></span><span class="theme-toggle-text"></span>';

    const syncTheme = (theme, persist = true) => {
        applyTheme(theme);
        updateThemeToggle(toggleButton, theme);

        if (persist) {
            window.localStorage.setItem(themeStorageKey, theme);
        }
    };

    syncTheme(getPreferredTheme(), false);

    toggleButton.addEventListener('click', () => {
        const nextTheme = toggleButton.getAttribute('data-theme-target') || 'dark';
        syncTheme(nextTheme);
    });

    return toggleButton;
};

applyTheme(getPreferredTheme());

if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
    siteNav.append(createThemeToggle());

    navToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            siteNav.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

const revealItems = document.querySelectorAll('.reveal, .reveal-card');

if ('IntersectionObserver' in window && revealItems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}