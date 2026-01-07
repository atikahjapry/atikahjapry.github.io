/**
 * Multilingual Translation System
 * Uses Google Translate widget for automatic translation to 100+ languages
 */

// ===== GOOGLE TRANSLATE INITIALIZATION =====
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ar,bn,zh-CN,zh-TW,nl,en,fr,de,hi,id,it,ja,ko,ms,pl,pt,ru,es,th,tr,uk,vi',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
    }, 'google_translate_element');

    // Apply saved language preference after widget loads
    setTimeout(() => {
        restoreLanguagePreference();
    }, 500);
}

// ===== LANGUAGE PREFERENCE PERSISTENCE =====
function saveLanguagePreference(langCode) {
    localStorage.setItem('preferredLanguage', langCode);
}

function restoreLanguagePreference() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== 'en') {
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
            selectElement.value = savedLang;
            selectElement.dispatchEvent(new Event('change'));
        }
    }
}

// ===== CUSTOM LANGUAGE SELECTOR =====
function createCustomLanguageSelector() {
    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'ko', name: '한국어', flag: '🇰🇷' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'pt', name: 'Português', flag: '🇧🇷' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
        { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
        { code: 'th', name: 'ไทย', flag: '🇹🇭' },
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
        { code: 'pl', name: 'Polski', flag: '🇵🇱' },
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
        { code: 'uk', name: 'Українська', flag: '🇺🇦' },
        { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
    ];

    // Create language dropdown HTML
    let optionsHTML = languages.map(lang =>
        `<div class="lang-option" data-lang="${lang.code}">
            <span class="lang-flag">${lang.flag}</span>
            <span class="lang-name">${lang.name}</span>
        </div>`
    ).join('');

    return `
        <div class="language-selector" id="languageSelector">
            <button class="lang-toggle" id="langToggle" aria-label="Select Language">
                <span class="lang-icon">🌐</span>
                <span class="current-lang">EN</span>
                <span class="lang-arrow">▼</span>
            </button>
            <div class="lang-dropdown" id="langDropdown">
                <div class="lang-search">
                    <input type="text" placeholder="Search language..." id="langSearch">
                </div>
                <div class="lang-options" id="langOptions">
                    ${optionsHTML}
                </div>
            </div>
        </div>
        <div id="google_translate_element" style="display: none;"></div>
    `;
}

// ===== LANGUAGE SELECTOR EVENT HANDLERS =====
function initLanguageSelector() {
    const toggle = document.getElementById('langToggle');
    const dropdown = document.getElementById('langDropdown');
    const search = document.getElementById('langSearch');
    const options = document.querySelectorAll('.lang-option');

    if (!toggle) return;

    // Toggle dropdown
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            search.focus();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            dropdown.classList.remove('active');
        }
    });

    // Search functionality
    search.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        options.forEach(option => {
            const langName = option.querySelector('.lang-name').textContent.toLowerCase();
            option.style.display = langName.includes(query) ? 'flex' : 'none';
        });
    });

    // Language selection
    options.forEach(option => {
        option.addEventListener('click', () => {
            const langCode = option.getAttribute('data-lang');
            const langName = option.querySelector('.lang-name').textContent;
            const langFlag = option.querySelector('.lang-flag').textContent;

            // Update UI
            document.querySelector('.current-lang').textContent = langCode.toUpperCase().split('-')[0];
            dropdown.classList.remove('active');

            // Trigger Google Translate
            selectLanguage(langCode);

            // Save preference
            saveLanguagePreference(langCode);
        });
    });
}

function selectLanguage(langCode) {
    // Use Google Translate API
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change'));
    }
}

// ===== INJECT LANGUAGE SELECTOR INTO NAVIGATION =====
function injectLanguageSelector() {
    // Find the nav-links container
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.getElementById('mobileMenu');

    // Create the language selector element
    const selectorHTML = createCustomLanguageSelector();

    // Insert in desktop nav (before theme toggle)
    if (navLinks) {
        const themeToggleLi = navLinks.querySelector('li:last-child');
        if (themeToggleLi) {
            const langLi = document.createElement('li');
            langLi.innerHTML = selectorHTML;
            navLinks.insertBefore(langLi, themeToggleLi);
        }
    }

    // Insert in mobile menu (before theme toggle)
    if (mobileMenu) {
        const mobileThemeToggle = mobileMenu.querySelector('.theme-toggle');
        if (mobileThemeToggle) {
            const mobileSelector = document.createElement('div');
            mobileSelector.innerHTML = createCustomLanguageSelector();
            mobileSelector.style.marginTop = '1rem';
            mobileMenu.insertBefore(mobileSelector, mobileThemeToggle);
        }
    }

    // Initialize event handlers
    initLanguageSelector();
}

// ===== HIDE GOOGLE TRANSLATE BANNER =====
function hideGoogleTranslateBanner() {
    const style = document.createElement('style');
    style.textContent = `
        .goog-te-banner-frame, .skiptranslate {
            display: none !important;
        }
        body {
            top: 0 !important;
        }
        .goog-te-gadget {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    // Inject language selector into navigation
    injectLanguageSelector();

    // Hide Google Translate default UI
    hideGoogleTranslateBanner();

    // Load Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
});
