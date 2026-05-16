// ============================================
// JUAN MALDONADO — Portfolio JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- CURSOR PERSONALIZADO ----
    const cursor   = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.left = followerX + 'px';
            follower.style.top  = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Efecto en hover de links
        document.querySelectorAll('a, button, .skill-pill, .project-card, .mini-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(2)';
                follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
                follower.style.borderColor = 'rgba(0,229,192,0.7)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(1)';
                follower.style.transform = 'translate(-50%,-50%) scale(1)';
                follower.style.borderColor = 'rgba(0,229,192,0.4)';
            });
        });
    }

    // ---- NAVBAR SCROLL ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---- HAMBURGER MENU ----
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        if (mobileMenu.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity   = '';
            spans[2].style.transform = '';
        }
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity   = '';
            spans[2].style.transform = '';
        });
    });

    // ---- SCROLL REVEAL ----
    const revealEls = document.querySelectorAll(
        '.skill-category, .project-featured, .mini-card, .about-stats .stat, .section-title, .section-sub'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach(el => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
    });

    // ---- CONTADOR STATS ----
    const stats = document.querySelectorAll('.stat-num');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el    = entry.target;
                const text  = el.textContent;
                const hasPlus = text.includes('+');
                const hasPct  = text.includes('%');
                const num   = parseInt(text.replace(/[^0-9]/g, ''));

                let current = 0;
                const step  = Math.max(1, Math.floor(num / 30));
                const timer = setInterval(() => {
                    current = Math.min(current + step, num);
                    el.textContent = (hasPlus ? '+' : '') + current + (hasPct ? '%' : '');
                    if (current >= num) clearInterval(timer);
                }, 40);

                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(s => statsObserver.observe(s));

    // ---- FORMULARIO FORMSPREE ----
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const btn  = form.querySelector('button[type="submit"]');
            const span = btn.querySelector('span');
            const icon = form.querySelector('button[type="submit"] i');

            btn.disabled = true;
            span.textContent = 'Enviando...';
            icon.className = 'fa-solid fa-spinner fa-spin';

            try {
                const res = await fetch('https://formspree.io/f/xjglqeyo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre:  form.querySelector('input[type="text"]').value,
                        email:   form.querySelector('input[type="email"]').value,
                        mensaje: form.querySelector('textarea').value,
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    btn.style.background = '#00c49a';
                    span.textContent = '¡Mensaje enviado!';
                    icon.className   = 'fa-solid fa-check';
                    form.reset();
                    setTimeout(() => {
                        span.textContent     = 'Enviar mensaje';
                        icon.className       = 'fa-solid fa-paper-plane';
                        btn.style.background = '';
                        btn.disabled         = false;
                    }, 3000);
                } else {
                    throw new Error(data?.error || 'Error del servidor');
                }
            } catch (err) {
                console.error('Error Formspree:', err);
                span.textContent     = 'Error, intentá de nuevo';
                icon.className       = 'fa-solid fa-triangle-exclamation';
                btn.style.background = '#e74c3c';
                btn.disabled         = false;
                setTimeout(() => {
                    span.textContent     = 'Enviar mensaje';
                    icon.className       = 'fa-solid fa-paper-plane';
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // ---- ACTIVE NAV LINK ON SCROLL ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        navLinks.forEach(a => {
            a.style.color = a.getAttribute('href') === '#' + current
                ? 'var(--accent)'
                : '';
        });
    });

});