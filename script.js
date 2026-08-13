document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. THEME TOGGLE SYSTEM (ACCESSIBLE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
            
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }
    }

    /* ==========================================================================
       2. SCROLL REVEAL ANIMATION (TRIGGER ONCE)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(element => revealObserver.observe(element));
    }

    /* ==========================================================================
       3. NAVIGATION HIGHLIGHTER (SCROLLSPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length > 0 && navLinks.length > 0) {
        const scrollspyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, {
            root: null,
            threshold: 0.5 // Menyalakan indikator jika 50% section terlihat di layar
        });

        sections.forEach(section => scrollspyObserver.observe(section));
    }

    /* ==========================================================================
       4. SPOTLIGHT MOUSE EFFECT
       ========================================================================== */
    const glowElements = document.querySelectorAll('.project-card, .contact-form');

    glowElements.forEach(element => {
        let ticking = false;

        element.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = element.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    element.style.setProperty('--mouse-x', `${x}px`);
                    element.style.setProperty('--mouse-y', `${y}px`);
                    element.style.setProperty('--glow-opacity', '1');
                    ticking = false;
                });
                ticking = true;
            }
        });

        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--glow-opacity', '0');
        });
    });

    /* ==========================================================================
       5. QUICK COPY EMAIL FEATURE
       ========================================================================== */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyBtnText = document.getElementById('copy-btn-text');
    const emailToCopy = "hariztoneverything@gmail.com";

    if (copyEmailBtn && copyBtnText) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailToCopy).then(() => {
                copyBtnText.innerText = "Tersalin!";
                copyEmailBtn.classList.add('copied');

                setTimeout(() => {
                    copyBtnText.innerText = "Salin Email";
                    copyEmailBtn.classList.remove('copied');
                }, 2500);
            }).catch(err => {
                console.error('Gagal menyalin text: ', err);
            });
        });
    }

    /* ==========================================================================
       6. AJAX FORM HANDLING (WEB3FORMS)
       ========================================================================== */
    const form = document.getElementById('contact-form');
    const result = document.getElementById('form-result');
    const submitBtn = document.getElementById('form-btn');
    const btnText = document.getElementById('btn-text');

    if (form && result && submitBtn) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (btnText) btnText.innerText = 'Mengirim Pesan...';
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
                let resJson = await response.json();
                if (response.status === 200) {
                    result.className = "form-result success";
                    result.innerHTML = "✨ Pesan berhasil terkirim! Saya akan segera membalasnya.";
                    form.reset();
                } else {
                    result.className = "form-result error";
                    result.innerHTML = resJson.message || "Terjadi kesalahan saat mengirim pesan.";
                }
            })
            .catch(() => {
                result.className = "form-result error";
                result.innerHTML = "Terjadi kesalahan koneksi. Silakan coba lagi nanti.";
            })
            .finally(() => {
                if (btnText) btnText.innerText = 'Kirim Pesan';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    result.innerHTML = "";
                    result.className = "form-result";
                }, 5000);
            });
        });
    }
});