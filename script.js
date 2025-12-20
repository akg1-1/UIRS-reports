document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.section-container, #preprocessing, #mesh-generation, #texturing');
    const navLinks = document.querySelectorAll('.toc-list a, .toc-sublist a');
    const backToTopBtn = document.getElementById('backToTop');
    const progressBar = document.querySelector('.toc-progress-bar');
    const progressContainer = document.getElementById('tocProgress');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalImage = modalOverlay.querySelector('.modal-image');
    const modalCaption = modalOverlay.querySelector('.modal-caption');

    progressContainer.style.display = 'block';

    function highlightCurrentSection() {
        let currentSectionId = '';
        let maxVisibleArea = 0;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

            if (visibleHeight > maxVisibleArea && visibleHeight > 0) {
                maxVisibleArea = visibleHeight;
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;

        if (documentHeight <= 0) return;

        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = `${Math.min(100, progress)}%`;
    }

    function toggleBackToTopButton() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = 100;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        highlightCurrentSection();
        toggleBackToTopButton();
        updateProgressBar();
    });

    document.querySelectorAll('.image-content img').forEach(img => {
        img.addEventListener('click', function () {
            modalImage.src = this.src;
            modalImage.alt = this.alt || 'Увеличенное изображение';
            const caption = this.closest('.image-placeholder')?.querySelector('.image-caption')?.textContent || '';
            modalCaption.textContent = caption;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.querySelectorAll('.image-content img').forEach(img => {
        const loader = document.createElement('div');
        loader.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 30px;
                    height: 30px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #4a90e2;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    z-index: 1;
                `;

        img.parentNode.style.position = 'relative';
        if (!img.parentNode.querySelector('.loader')) {
            img.parentNode.appendChild(loader);
        }

        if (img.complete) {
            loader.remove();
        } else {
            img.addEventListener('load', function () {
                loader.remove();
            });

            img.addEventListener('error', function () {
                loader.remove();
                console.error('Ошибка загрузки изображения:', this.src);
            });
        }
    });

    highlightCurrentSection();
    toggleBackToTopButton();
    updateProgressBar();

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
document.addEventListener('DOMContentLoaded', function () {
    // ... существующий код ...

    // Добавляем обработку бокового оглавления
    const sidebarToc = document.getElementById('sidebarToc');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainToc = document.querySelector('.toc-wrapper');
    const sidebarLinks = document.querySelectorAll('.sidebar-toc a');

    function checkSidebarTocVisibility() {
        if (!mainToc || !sidebarToc) return;

        const mainTocRect = mainToc.getBoundingClientRect();

        // Если основное оглавление скрыто (вышло за верхний край экрана)
        if (mainTocRect.bottom < 100) {
            sidebarToc.classList.add('active');
            sidebarToggle.classList.add('visible');
        } else {
            sidebarToc.classList.remove('active');
            sidebarToggle.classList.remove('visible');
        }

        // Подсветка активного раздела в боковом оглавлении
        const sections = document.querySelectorAll('.section-container, #preprocessing, #mesh-generation');
        let currentSectionId = '';
        let maxVisibleArea = 0;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

            if (visibleHeight > maxVisibleArea && visibleHeight > 0) {
                maxVisibleArea = visibleHeight;
                currentSectionId = section.id;
            }
        });

        // Удаляем активный класс у всех ссылок бокового оглавления
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            // Удаляем класс active-section у родительского li
            const parentLi = link.closest('li');
            if (parentLi) {
                parentLi.classList.remove('active-section');
            }
        });

        // Добавляем активный класс текущему разделу
        sidebarLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
                // Добавляем класс active-section родительскому li
                const parentLi = link.closest('li');
                if (parentLi) {
                    parentLi.classList.add('active-section');
                }
            }
        });
    }

    // Обработчик кликов для ссылок бокового оглавления
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = 100;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Закрываем боковое оглавление на мобильных устройствах
                if (window.innerWidth <= 1200) {
                    sidebarToc.classList.remove('active');
                    sidebarToggle.classList.add('visible');
                }
            }
        });
    });

    // Обработчик для кнопки переключения бокового оглавления
    sidebarToggle.addEventListener('click', function () {
        sidebarToc.classList.toggle('active');
        // Анимация кнопки
        this.style.transform = sidebarToc.classList.contains('active') ? 'rotate(180deg) scale(1.1)' : 'rotate(0) scale(1)';
    });

    // Обновляем функцию highlightCurrentSection для работы с боковым оглавлением
    function highlightCurrentSection() {
        // ... существующий код ...

        // Также обновляем боковое оглавление
        checkSidebarTocVisibility();
    }

    // Добавляем обработку скролла для бокового оглавления
    window.addEventListener('scroll', () => {
        // ... существующий код ...
        checkSidebarTocVisibility();
    });

    // Инициализация при загрузке
    checkSidebarTocVisibility();

    // Обработчик ресайза окна
    window.addEventListener('resize', function () {
        // На мобильных устройствах скрываем боковое оглавление
        if (window.innerWidth <= 1200) {
            sidebarToc.classList.remove('active');
        }
    });

});