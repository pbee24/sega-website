/* --- Mobile Navigation Toggle --- */
function initMobileNav() {
    const toggle = document.getElementById('mobileNavToggle');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link, .nav-btn');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });
    }
}
