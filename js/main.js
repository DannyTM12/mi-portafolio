/**
 * ==========================================================================
 * PORTAFOLIO — MAIN JS
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. MENÚ MÓVIL (HAMBURGUESA)
       -------------------------------------------------------------------------- */
    const navToggle = document.getElementById('nav-toggle');
    const primaryNav = document.getElementById('primary-nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle && primaryNav) {
        // Abrir/Cerrar menú
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNav.classList.toggle('is-open');
        });

        // Cerrar menú al hacer clic en un enlace (para cuando navegas a una sección)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('is-open');
            });
        });
    }

    /* --------------------------------------------------------------------------
       2. MODO OSCURO / CLARO
       -------------------------------------------------------------------------- */
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determinar el tema inicial
    let currentTheme = 'light';
    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (systemPrefersDark) {
        currentTheme = 'dark';
    }

    // Aplicar el tema al documento
    htmlElement.setAttribute('data-theme', currentTheme);

    // NOTA: Si en el futuro quieres añadir un botón para cambiar el tema manualmente,
    // solo necesitas crear un botón con el id "theme-toggle" en tu HTML.
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    /* --------------------------------------------------------------------------
       3. ANIMACIONES AL SCROLL (Intersection Observer)
       -------------------------------------------------------------------------- */
    // Añadimos dinámicamente la clase 'reveal' a los elementos importantes
    // para no tener que editar el HTML a mano.
    const elementsToReveal = document.querySelectorAll(
        '.section__header, .about__paragraph, .about__facts, .skill-category, .project-card, .contact-form, .contact__links'
    );
    elementsToReveal.forEach(el => el.classList.add('reveal'));

    const revealElements = document.querySelectorAll('.reveal');

    // Configuración del observador
    const revealOptions = {
        threshold: 0.15, // Porcentaje del elemento que debe ser visible para animarse
        rootMargin: "0px 0px -50px 0px" // Margen inferior antes de disparar la animación
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Dejamos de observarlo para que solo se anime una vez
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* --------------------------------------------------------------------------
       4. MANEJO DEL FORMULARIO DE CONTACTO
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const feedbackDiv = document.getElementById('contact-feedback');

    if (contactForm && feedbackDiv) {
        contactForm.addEventListener('submit', (e) => {
            // Evitar que la página se recargue al enviar
            e.preventDefault();

            // Referencias a los campos
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            const submitBtn = document.getElementById('contact-submit');

            // Validación muy básica (HTML5 ya hace gran parte del trabajo por los atributos 'required')
            if (name === '' || email === '' || message === '') {
                showFeedback('Por favor, completa todos los campos.', 'error');
                return;
            }

            // Simulación de estado de carga
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn__label">Enviando...</span>';
            submitBtn.disabled = true;
            submitBtn.style.cursor = 'wait';

            // Simulamos el tiempo de envío al servidor (1.5 segundos)
            setTimeout(() => {
                showFeedback('¡Gracias por tu mensaje! Me pondré en contacto contigo muy pronto.', 'success');
                
                // Limpiar el formulario y restaurar el botón
                contactForm.reset();
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
                submitBtn.style.cursor = 'pointer';
            }, 1500);
        });
    }

    // Función auxiliar para mostrar el mensaje de éxito o error
    function showFeedback(message, type) {
        feedbackDiv.textContent = message;
        // Asignamos las clases correspondientes (definidas en el CSS)
        feedbackDiv.className = `contact-form__feedback contact-form__feedback--${type}`;
        feedbackDiv.hidden = false;

        // Ocultar el mensaje automáticamente después de 6 segundos
        setTimeout(() => {
            feedbackDiv.hidden = true;
        }, 6000);
    }

});