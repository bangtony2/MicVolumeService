document.addEventListener("DOMContentLoaded", () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated in
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements with the 'animate-up' class
    const animatedElements = document.querySelectorAll('.animate-up');
    
    // Add a slight delay for elements already in viewport on load
    setTimeout(() => {
        animatedElements.forEach(el => observer.observe(el));
    }, 100);

    // Dynamic background blob movement based on mouse position (optional premium effect)
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');
    
    if (blob1 && blob2) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // Move blobs slightly based on mouse, maintaining their fixed position CSS
            blob1.style.transform = `translate(${x * 3}%, ${y * 3}%)`;
            blob2.style.transform = `translate(${x * -3}%, ${y * -3}%)`;
        });
    }
});
