document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       READING PROGRESS BAR
       ========================================= */
    const progressBar = document.getElementById("myBar");

    // Check if element exists before adding listener
    if (progressBar) {
        window.onscroll = function () {
            updateProgressBar();
        };
    }

    function updateProgressBar() {
        // Calculate how far down the user has scrolled
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        // Calculate the total scrollable height
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // Calculate percentage
        const scrolled = (winScroll / height) * 100;

        // Apply width to the bar
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    }

});