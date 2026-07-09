/* --- Dynamic Stats Counter --- */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower

    const startCounting = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let count = 0;

                const updateCount = () => {
                    const inc = target / speed;
                    if (count < target) {
                        count += inc;
                        if (target === 2017) {
                            counter.innerText = Math.floor(count);
                        } else if (target === 500 || target === 100) {
                            counter.innerText = `~${Math.floor(count)}`;
                        } else {
                            counter.innerText = Math.floor(count);
                        }
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target === 2017 ? target : (target === 500 || target === 100 ? `~${target}` : target);
                    }
                };

                updateCount();
                observer.unobserve(counter); // Stop observing once animated
            }
        });
    };

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(startCounting, observerOptions);
    stats.forEach(stat => observer.observe(stat));
}
