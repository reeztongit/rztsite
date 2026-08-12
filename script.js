document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // 1. Cek simpanan tema di localStorage / preferensi browser
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    // Set tema awal
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // 2. Event click untuk toggle tema
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

    
    });
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        threshold: 0.15, // Muncul saat 15% bagian elemen masuk layar
        rootMargin: "0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // Aktifkan animasi CSS
                observer.unobserve(entry.target);     // Jalankan animasi 1x saja
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Menghitung posisi kursor mouse di dalam kartu proyek
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posisi X mouse relatif terhadap kartu
            const y = e.clientY - rect.top;  // Posisi Y mouse relatif terhadap kartu

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    // Interactive Mouse Tracking dengan Jangkauan & Ayunan Abstrak
    const interactiveOrb = document.getElementById('interactive-orb');

    if (interactiveOrb) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let orbX = mouseX;
        let orbY = mouseY;
        let rotation = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateOrb() {
            // Angka 0.03 membuat pergerakannya mengejar lebih lambat sehingga ayunannya terasa lebih jauh
            orbX += (mouseX - orbX) * 0.03; 
            orbY += (mouseY - orbY) * 0.03;
            rotation += 0.2; // Memutar orb kursor perlahan secara terus menerus

            interactiveOrb.style.transform = `translate(${orbX - 200}px, ${orbY - 175}px) rotate(${rotation}deg)`;
            requestAnimationFrame(animateOrb);
        }

        animateOrb();
    }
});