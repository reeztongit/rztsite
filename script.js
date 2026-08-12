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
        threshold: 0.4, // Cukup 10% elemen terlihat untuk muncul
        rootMargin: "-50px 0px -50px 0px" // Memberi jarak toleransi 50px agar tidak mendadak hilang di tepi layar
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Hanya hapus class active jika elemen benar-benar keluar jauh dari layar
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

// Aktifkan Efek Spotlight Mouse untuk Kartu Proyek DAN Form Kontak
const glowElements = document.querySelectorAll('.project-card, .contact-form');

glowElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        element.style.setProperty('--mouse-x', `${x}px`);
        element.style.setProperty('--mouse-y', `${y}px`);
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

    // --- AJAX Form Handling Web3Forms ---
    const form = document.getElementById('contact-form');
    const result = document.getElementById('form-result');
    const submitBtn = document.getElementById('form-btn');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ubah teks tombol saat sedang mengirim
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Mengirim...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.className = "form-result success";
                    result.innerHTML = "✨ Pesan berhasil terkirim! Saya akan segera membalasnya.";
                } else {
                    result.className = "form-result error";
                    result.innerHTML = json.message;
                }
            })
            .catch(error => {
                result.className = "form-result error";
                result.innerHTML = "Terjadi kesalahan. Silakan coba lagi nanti.";
            })
            .then(function() {
                // Reset form dan tombol
                form.reset();
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                
                // Sembunyikan notifikasi setelah 5 detik
                setTimeout(() => {
                    result.style.display = "none";
                }, 5000);
            });
        });
    }
});