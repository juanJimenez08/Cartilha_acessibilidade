document.addEventListener('DOMContentLoaded', () => {
    // 1. Rolagem Suave para os Links do Menu
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Efeito Fade-in ao Rolar a Página
    const sections = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // Observa a partir da viewport
        threshold: 0.1 // A animação começa quando 10% do elemento está visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Deixa de observar o elemento após a animação
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Modo claro/escuro
    const themeToggle = document.getElementById('theme-toggle');
    const themeText = document.getElementById('theme-text');
    const themeIcon = document.getElementById('theme-icon');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeText.textContent = 'Tema escuro';
            document.getElementById('icon-sun').style.display = 'none';
            document.getElementById('icon-moon').style.display = 'inline';
        } else {
            themeText.textContent = 'Tema claro';
            document.getElementById('icon-sun').style.display = 'inline';
            document.getElementById('icon-moon').style.display = 'none';
        }
    });

    // Cabeçalho menor ao rolar
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 60) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    });

    // Botão "voltar ao topo"
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Ampliar imagem do mapa mental com zoom
    const thumb = document.querySelector('.mapa-mental-thumb');
    const modal = document.getElementById('mapa-mental-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalImg = modal ? modal.querySelector('.modal-img') : null;

    let scale = 1;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let imgX = 0;
    let imgY = 0;

    if (thumb && modal && closeBtn && modalImg) {
        thumb.addEventListener('click', () => {
            modal.style.display = 'flex';
            scale = 1;
            imgX = 0;
            imgY = 0;
            modalImg.style.transform = 'scale(1) translate(0px, 0px)';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Zoom com roda do mouse
        modalImg.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                scale = Math.min(scale + 0.2, 3);
            } else {
                scale = Math.max(scale - 0.2, 1);
                imgX = 0;
                imgY = 0;
            }
            modalImg.style.transform = `scale(${scale}) translate(${imgX}px, ${imgY}px)`;
        });

        // Arrastar com mouse
        modalImg.addEventListener('mousedown', (e) => {
            if (scale > 1) {
                isDragging = true;
                startX = e.clientX - imgX;
                startY = e.clientY - imgY;
                modalImg.style.cursor = 'grab';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                imgX = e.clientX - startX;
                imgY = e.clientY - startY;
                modalImg.style.transform = `scale(${scale}) translate(${imgX}px, ${imgY}px)`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            modalImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
        });

        // Arrastar com touch (mobile)
        let lastTouchX = 0;
        let lastTouchY = 0;
        modalImg.addEventListener('touchstart', (e) => {
            if (scale > 1 && e.touches.length === 1) {
                isDragging = true;
                lastTouchX = e.touches[0].clientX - imgX;
                lastTouchY = e.touches[0].clientY - imgY;
            }
        });

        modalImg.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                imgX = e.touches[0].clientX - lastTouchX;
                imgY = e.touches[0].clientY - lastTouchY;
                modalImg.style.transform = `scale(${scale}) translate(${imgX}px, ${imgY}px)`;
            }
        });

        modalImg.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Zoom com pinch (mobile)
        let initialDistance = null;
        modalImg.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        });

        modalImg.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialDistance) {
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                if (currentDistance > initialDistance) {
                    scale = Math.min(scale + 0.05, 3);
                } else {
                    scale = Math.max(scale - 0.05, 1);
                    imgX = 0;
                    imgY = 0;
                }
                modalImg.style.transform = `scale(${scale}) translate(${imgX}px, ${imgY}px)`;
                initialDistance = currentDistance;
            }
        });

        modalImg.addEventListener('touchend', () => {
            initialDistance = null;
            isDragging = false;
        });

        // Acessibilidade: fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
            }
        });
    }

    // Acesso às fontes
    const fontAccessBtn = document.getElementById('font-access-btn');
    const fontPopup = document.getElementById('font-popup');
    const closeFontPopup = document.getElementById('close-font-popup');

    if (fontAccessBtn && fontPopup && closeFontPopup) {
        fontAccessBtn.addEventListener('click', () => {
            fontPopup.style.display = 'flex';
            closeFontPopup.focus();
        });

        closeFontPopup.addEventListener('click', () => {
            fontPopup.style.display = 'none';
            fontAccessBtn.focus();
        });

        fontPopup.addEventListener('click', (e) => {
            if (e.target === fontPopup) {
                fontPopup.style.display = 'none';
                fontAccessBtn.focus();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (fontPopup.style.display === 'flex' && e.key === 'Escape') {
                fontPopup.style.display = 'none';
                fontAccessBtn.focus();
            }
        });
    }

    // Menu hamburguer
    const menuToggle = document.getElementById('menu-toggle');
    const navUl = document.querySelector('.main-nav ul');
    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navUl.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }
});