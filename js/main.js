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

    let currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
    htmlElement.setAttribute('data-theme', currentTheme);

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeToggleBtn && themeIcon) {
        const updateThemeIcon = (theme) => {
            if (theme === 'dark') {
                // SVG de Sol
                themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
            } else {
                // SVG de Luna
                themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
            }
        };

        updateThemeIcon(currentTheme);

        themeToggleBtn.addEventListener('click', () => {
            currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateThemeIcon(currentTheme);
        });
    }

    /* --------------------------------------------------------------------------
       2.1. TOGGLE DE IDIOMA (Traducción en tiempo real)
       -------------------------------------------------------------------------- */
    const langToggleBtn = document.getElementById('lang-toggle');
    // Seleccionamos todos los elementos que tengan traducciones disponibles
    const translatableElements = document.querySelectorAll('[data-en]');

    if (langToggleBtn) {
        // Revisamos si el usuario ya había elegido un idioma antes, si no, por defecto español
        let currentLang = localStorage.getItem('language') || 'es';

        // Función que se encarga de cambiar todo el texto
        const applyLanguage = (lang) => {
            translatableElements.forEach(el => {
                // Reemplaza el contenido HTML por el que está en el atributo (data-es o data-en)
                if (el.hasAttribute(`data-${lang}`)) {
                    el.innerHTML = el.getAttribute(`data-${lang}`);
                }
            });

            // Actualizar placeholder de inputs y textareas con atributos data-placeholder-es/data-placeholder-en
            const placeholderSelector = 'input[data-placeholder-es], input[data-placeholder-en], textarea[data-placeholder-es], textarea[data-placeholder-en]';
            const placeholderElements = document.querySelectorAll(placeholderSelector);
            placeholderElements.forEach(el => {
                const attr = `data-placeholder-${lang}`;
                if (el.hasAttribute(attr)) {
                    el.placeholder = el.getAttribute(attr);
                }
            });

            // Actualiza el texto del botón (si estamos en 'es', el botón dice 'EN' para invitar a cambiar)
            langToggleBtn.textContent = lang === 'es' ? 'EN' : 'ES';

            // Buenas prácticas: actualizar el atributo lang del <html> y guardar la preferencia
            document.documentElement.lang = lang;
            localStorage.setItem('language', lang);
        };

        // Aplicar el idioma inicial al cargar la página
        applyLanguage(currentLang);

        // Evento para cambiar el idioma al hacer clic
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            applyLanguage(currentLang);
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
       4. MANEJO DEL FORMULARIO DE CONTACTO (VERSIÓN REAL CON FORMSPREE)
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const feedbackDiv = document.getElementById('contact-feedback');

    if (contactForm && feedbackDiv) {
        contactForm.addEventListener('submit', async (e) => {
            // Evitamos que te mande a la página fea de Formspree
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            const submitBtn = document.getElementById('contact-submit');

            if (name === '' || email === '' || message === '') {
                showFeedback('Por favor, completa todos los campos.', 'error');
                return;
            }

            // Estado de carga visual
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn__label">Enviando...</span>';
            submitBtn.disabled = true;
            submitBtn.style.cursor = 'wait';

            // ENVÍO REAL A FORMSPREE
            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showFeedback('¡Gracias por tu mensaje! Me pondré en contacto contigo muy pronto.', 'success');
                    contactForm.reset();
                } else {
                    showFeedback('Hubo un problema al enviar el mensaje. Revisa tu red.', 'error');
                }
            } catch (error) {
                showFeedback('Error de conexión. Intenta de nuevo más tarde.', 'error');
            } finally {
                // Restauramos el botón
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
                submitBtn.style.cursor = 'pointer';
            }
        });
    }

    // Función auxiliar para mostrar el mensaje
    function showFeedback(message, type) {
        feedbackDiv.textContent = message;
        feedbackDiv.className = `contact-form__feedback contact-form__feedback--${type}`;
        feedbackDiv.hidden = false;

        setTimeout(() => {
            feedbackDiv.hidden = true;
        }, 6000);
    }

    /* --------------------------------------------------------------------------
       5. BOTÓN VOLVER ARRIBA
       -------------------------------------------------------------------------- */
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        // Mostrar/ocultar el botón basado en el scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('is-visible');
            } else {
                backToTopBtn.classList.remove('is-visible');
            }
        });

        // Acción de scroll hacia arriba
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Añadir clase `site-header--scrolled` al hacer scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.site-header');
        if (header) {
            header.classList.toggle('site-header--scrolled', window.scrollY > 10);
        }
    });

});