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
});