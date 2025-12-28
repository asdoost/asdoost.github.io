document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       ELEMENTS
       ========================================= */
    const htmlElement = document.documentElement;
    const langSwitch = document.getElementById('langSwitch');
    const rtlStylesheet = document.getElementById('bootstrap-rtl-link');
    const sidebar = document.getElementById('offcanvasNavbar');

    /* =========================================
       LANGUAGE LOGIC
       ========================================= */
    function updateLanguage(isPersian) {
        // Determine active language codes and direction
        const lang = isPersian ? 'fa' : 'en';
        const dir = isPersian ? 'rtl' : 'ltr';

        // Update HTML attributes
        htmlElement.setAttribute('lang', lang);
        htmlElement.setAttribute('dir', dir);

        // Toggle Bootstrap RTL CSS
        if (rtlStylesheet) {
            if (isPersian) {
                rtlStylesheet.removeAttribute('disabled');
            } else {
                rtlStylesheet.setAttribute('disabled', 'true');
            }
        }

        // --- FIX FOR SIDEBAR DIRECTION ---
        // English (LTR): Right side = offcanvas-end
        // Persian (RTL): Right side = offcanvas-start
        if (sidebar) {
            if (isPersian) {
                sidebar.classList.remove('offcanvas-end');
                sidebar.classList.add('offcanvas-start');
            } else {
                sidebar.classList.remove('offcanvas-start');
                sidebar.classList.add('offcanvas-end');
            }
        }

        // Show/Hide Elements based on lang attribute
        const enElements = document.querySelectorAll('[lang="en"]');
        const faElements = document.querySelectorAll('[lang="fa"]');

        if (isPersian) {
            enElements.forEach(el => el.hidden = true);
            faElements.forEach(el => el.hidden = false);
        } else {
            enElements.forEach(el => el.hidden = false);
            faElements.forEach(el => el.hidden = true);
        }
    }

    // Only run if the language switch exists on the page
    if (langSwitch) {
        // Initial Setup
        updateLanguage(langSwitch.checked);

        // Event Listener for Language Change
        langSwitch.addEventListener('change', function () {
            updateLanguage(this.checked);
        });
    }
});