/**
 * Teacher's Day Website — Foundation Script
 * Scene navigation, particles, and core interactions
 */

(function () {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================

    const TOTAL_SCENES = 8;
    const PARTICLE_COUNT = 18;
    const PARTICLE_MIN_SIZE = 3;
    const PARTICLE_MAX_SIZE = 8;
    const PARTICLE_MIN_DURATION = 18000;
    const PARTICLE_MAX_DURATION = 35000;
    const PARTICLE_MIN_OPACITY = 0.06;
    const PARTICLE_MAX_OPACITY = 0.18;

    // Book Animation Timing
    const BOOK_OPEN_DURATION = 1200;
    const BOOK_COVER_DELAY = 300;
    const BOOK_PAGES_DELAY = 500;
    const BOOK_LIGHT_DELAY = 700;
    const BOOK_TEXT_DELAY = 900;
    const BOOK_CONTINUE_DELAY = 1400;
    const BOOK_PARTICLE_COUNT = 12;

    // Scene 2 — Classroom Timing
    const CLASSROOM_DUST_COUNT = 15;
    const CHALK_DUST_COUNT = 8;
    const CLASSROOM_SEQUENCE = {
        classroomDelay: 200,
        windowDelay: 300,
        desksDelay: 400,
        teacherDelay: 500,
        studentsDelay: 700,
        chalkboardDelay: 600,
        chalkWriteDelay: 1200,
        textMainDelay: 2400,
        lessonStartDelay: 3200,
        lessonInterval: 450,
        reflectionDelay: 6000,
        continueDelay: 7000
    };

    // Scene 3 — Memory Cards Timing
    const MEMORY_SEQUENCE = {
        titleDelay: 200,
        subtitleDelay: 800,
        cardBaseDelay: 1400,
        cardInterval: 700,
        transitionDelay: 4600,
        statementDelay: 5800,
        continueDelay: 6600
    };

    // Scene 4 — Growing Tree Timing
    const TREE_SEQUENCE = {
        primaryDelay: 400,
        growReadyDelay: 900,
        line1Delay: 2800,
        line2Delay: 3800,
        line3Delay: 4800,
        line4Delay: 5800,
        grownDelay: 6300,
        leadDelay: 7000,
        focusDelay: 8300,
        continueDelay: 9400
    };

    // ========================================
    // STATE
    // ========================================

    let currentScene = 1;
    let isTransitioning = false;
    let particles = [];
    let prefersReducedMotion = false;
    let bookOpened = false;
    let scene2Animated = false;
    let scene3Animated = false;
    let scene4Animated = false;

    // ========================================
    // DOM ELEMENTS
    // ========================================

    const progressBarFill = document.querySelector('.progress-bar-fill');
    const sceneCounter = document.querySelector('.scene-counter');
    const particlesContainer = document.querySelector('.particles-container');
    const scenes = [];

    // Book Elements
    const book = document.getElementById('book');
    const btnOpen = document.getElementById('btn-open');
    const btnNext1 = document.getElementById('btn-next-1');
    const bookParticlesContainer = document.getElementById('book-particles');

    // Scene 2 — Classroom Elements
    const classroomWrapper = document.getElementById('classroom-wrapper');
    const chalkboard = document.getElementById('chalkboard');
    const teacherSilhouette = document.getElementById('teacher-silhouette');
    const studentsSilhouettes = document.getElementById('students-silhouettes');
    const desks = document.getElementById('desks');
    const dustParticlesContainer = document.getElementById('dust-particles');
    const chalkDust = document.getElementById('chalk-dust');
    const windowEl = document.getElementById('window');
    const classroomText = document.getElementById('classroom-text');
    const textMain = document.getElementById('text-main');
    const textLessons = document.getElementById('text-lessons');
    const textReflection = document.getElementById('text-reflection');
    const btnNext2 = document.getElementById('btn-next-2');

    // Scene 3 — Memory Cards Elements
    const memoryTitle = document.getElementById('memory-title');
    const memorySubtitle = document.getElementById('memory-subtitle');
    const memoryCards = document.getElementById('memory-cards');
    const transitionLine = document.getElementById('transition-line');
    const emotionalStatement = document.getElementById('emotional-statement');
    const btnNext3 = document.getElementById('btn-next-3');

    // Scene 4 — Growing Tree Elements
    const treePrimary = document.getElementById('tree-primary');
    const treeStage = document.getElementById('tree-stage');
    const growthLine1 = document.getElementById('growth-line-1');
    const growthLine2 = document.getElementById('growth-line-2');
    const growthLine3 = document.getElementById('growth-line-3');
    const growthLine4 = document.getElementById('growth-line-4');
    const emotionalLead = document.getElementById('emotional-lead');
    const emotionalFocus = document.getElementById('emotional-focus');
    const btnNext4 = document.getElementById('btn-next-4');

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        cacheElements();
        detectReducedMotion();
        createParticles();
        bindEvents();
        updateProgress();
        updateCounter();
        setInitialScene();
        initBook();
        initClassroom();
        initMemoryCards();
        initTree();
    }

    function cacheElements() {
        for (let i = 1; i <= TOTAL_SCENES; i++) {
            const scene = document.getElementById(`scene-${i}`);
            if (scene) {
                scenes.push(scene);
            }
        }
    }

    function detectReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReducedMotion = mediaQuery.matches;

        mediaQuery.addEventListener('change', (e) => {
            prefersReducedMotion = e.matches;
            if (prefersReducedMotion) {
                pauseParticles();
            } else {
                resumeParticles();
            }
        });
    }

    function setInitialScene() {
        scenes.forEach((scene, index) => {
            if (index === 0) {
                scene.classList.add('active');
                scene.hidden = false;
            } else {
                scene.classList.remove('active');
                scene.hidden = true;
            }
        });
    }

    // ========================================
    // BOOK INITIALIZATION
    // ========================================

    function initBook() {
        if (!book || !btnOpen) return;

        btnOpen.addEventListener('click', handleBookOpen);
        btnOpen.addEventListener('keydown', handleBookOpenKeydown);

        if (btnNext1) {
            btnNext1.addEventListener('click', handleNextClick);
            btnNext1.addEventListener('keydown', handleNextKeydown);
        }
    }

    function handleBookOpenKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBookOpen();
        }
    }

    function handleBookOpen() {
        if (bookOpened) return;
        bookOpened = true;

        // Start opening sequence
        book.classList.add('opening');

        // Button fade out
        btnOpen.style.transition = 'opacity 300ms ease, transform 300ms ease';
        btnOpen.style.opacity = '0';
        btnOpen.style.transform = 'translateY(-10px)';
        btnOpen.disabled = true;

        // Hide button after fade
        setTimeout(() => {
            btnOpen.hidden = true;
        }, 300);

        // Book moves forward slightly
        setTimeout(() => {
            book.style.transform = 'translateZ(40px)';
        }, 100);

        // Cover opens
        setTimeout(() => {
            book.classList.add('open');
        }, BOOK_COVER_DELAY);

        // Pages thickness appears
        setTimeout(() => {
            // Handled by CSS .book.open .pages-thickness
        }, BOOK_PAGES_DELAY);

        // Inner light appears
        setTimeout(() => {
            // Handled by CSS .book.open .book-light
        }, BOOK_LIGHT_DELAY);

        // Emit particles from book
        setTimeout(() => {
            emitBookParticles();
        }, BOOK_LIGHT_DELAY + 100);

        // Text reveals (handled by CSS transitions on .book.open)
        // Continue button appears
        setTimeout(() => {
            if (btnNext1) {
                btnNext1.hidden = false;
                // Force reflow
                btnNext1.offsetHeight;
                btnNext1.classList.add('visible');
            }
        }, BOOK_CONTINUE_DELAY);

        // Clean up opening class
        setTimeout(() => {
            book.classList.remove('opening');
        }, BOOK_OPEN_DURATION + 200);
    }

    function emitBookParticles() {
        if (prefersReducedMotion || !bookParticlesContainer) return;

        const bookRect = book.getBoundingClientRect();
        const centerX = bookRect.width / 2;
        const centerY = bookRect.height / 2;

        for (let i = 0; i < BOOK_PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'book-particle';

            const size = random(4, 10);
            const angle = random(-Math.PI * 0.4, -Math.PI * 0.6); // Upward spread
            const distance = random(60, 180);
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - random(40, 100); // Extra upward
            const delay = random(0, 300);

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${centerX}px;
                top: ${centerY}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                animation-delay: ${delay}ms;
            `;

            bookParticlesContainer.appendChild(particle);

            // Activate animation
            requestAnimationFrame(() => {
                particle.classList.add('active');
            });

            // Remove after animation
            setTimeout(() => {
                particle.remove();
            }, 2000 + delay);
        }
    }

    // ========================================
    // CLASSROOM — SCENE 2
    // ========================================

    function initClassroom() {
        if (btnNext2) {
            btnNext2.addEventListener('click', handleNextClick);
            btnNext2.addEventListener('keydown', handleNextKeydown);
        }
    }

    function animateClassroom() {
        if (scene2Animated) return;
        scene2Animated = true;

        const s = CLASSROOM_SEQUENCE;

        // Classroom fades in
        setTimeout(() => classroomWrapper.classList.add('visible'), s.classroomDelay);

        // Window + sunlight
        setTimeout(() => windowEl.classList.add('visible'), s.windowDelay);

        // Desks fade in
        setTimeout(() => desks.classList.add('visible'), s.desksDelay);

        // Teacher silhouette appears
        setTimeout(() => teacherSilhouette.classList.add('visible'), s.teacherDelay);

        // Students appear
        setTimeout(() => studentsSilhouettes.classList.add('visible'), s.studentsDelay);

        // Chalkboard draws in
        setTimeout(() => chalkboard.classList.add('visible'), s.chalkboardDelay);

        // Chalk writing animation
        setTimeout(() => startChalkWriting(), s.chalkWriteDelay);

        // Main emotional text
        setTimeout(() => textMain.classList.add('visible'), s.textMainDelay);

        // Lessons reveal one by one
        const lessonLines = textLessons.querySelectorAll('.lesson-line');
        lessonLines.forEach((line, index) => {
            setTimeout(() => line.classList.add('visible'), s.lessonStartDelay + index * s.lessonInterval);
        });

        // Reflection text
        setTimeout(() => textReflection.classList.add('visible'), s.reflectionDelay);

        // Continue button appears
        setTimeout(() => {
            if (btnNext2) {
                btnNext2.hidden = false;
                btnNext2.offsetHeight;
                btnNext2.classList.add('visible');
            }
        }, s.continueDelay);

        // Sun dust particles
        setTimeout(() => createSunDust(), s.windowDelay + 200);
    }

    function startChalkWriting() {
        chalkboard.classList.add('writing');
        setTimeout(() => createChalkDust(1), 500);
        setTimeout(() => createChalkDust(2), 1600);
    }

    function createChalkDust(batch) {
        if (prefersReducedMotion || !chalkDust) return;

        const offset = batch === 1 ? 0 : CHALK_DUST_COUNT;
        for (let i = 0; i < CHALK_DUST_COUNT; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';

            dust.style.left = random(10, 90) + '%';
            dust.style.bottom = random(0, 30) + 'px';
            dust.style.animationDelay = random(0, 300) + 'ms';

            chalkDust.appendChild(dust);

            requestAnimationFrame(() => dust.classList.add('active'));

            setTimeout(() => dust.remove(), 1800 + random(0, 500));
        }
    }

    function createSunDust() {
        if (prefersReducedMotion || !dustParticlesContainer) return;

        for (let i = 0; i < CLASSROOM_DUST_COUNT; i++) {
            const dust = document.createElement('div');
            dust.className = 'sun-dust';

            const duration = random(4000, 8000);
            const delay = random(0, 4000);
            const size = random(2, 4);
            const tx = random(-30, 30);
            const ty = random(-40, -10);

            dust.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${random(20, 60)}%;
                top: ${random(15, 50)}%;
                --dust-duration: ${duration}ms;
                --dust-delay: ${delay}ms;
                --dust-tx: ${tx}px;
                --dust-ty: ${ty}px;
            `;

            dustParticlesContainer.appendChild(dust);

            requestAnimationFrame(() => dust.classList.add('active'));
        }
    }

    // ========================================
    // MEMORY CARDS — SCENE 3
    // ========================================

    function initMemoryCards() {
        if (btnNext3) {
            btnNext3.addEventListener('click', handleNextClick);
            btnNext3.addEventListener('keydown', handleNextKeydown);
        }
    }

    function animateMemoryCards() {
        if (scene3Animated) return;
        scene3Animated = true;

        const m = MEMORY_SEQUENCE;

        // Title fades in
        setTimeout(() => memoryTitle.classList.add('visible'), m.titleDelay);

        // Subtitle appears
        setTimeout(() => memorySubtitle.classList.add('visible'), m.subtitleDelay);

        // Cards appear one by one
        const cards = memoryCards.querySelectorAll('.memory-card');
        cards.forEach((card, index) => {
            setTimeout(() => card.classList.add('visible'), m.cardBaseDelay + index * m.cardInterval);
        });

        // Transition line appears after cards
        setTimeout(() => transitionLine.classList.add('visible'), m.transitionDelay);

        // Emotional statement appears
        setTimeout(() => emotionalStatement.classList.add('visible'), m.statementDelay);

        // Continue button appears
        setTimeout(() => {
            if (btnNext3) {
                btnNext3.hidden = false;
                btnNext3.offsetHeight;
                btnNext3.classList.add('visible');
            }
        }, m.continueDelay);
    }

    // ========================================
    // GROWING TREE — SCENE 4
    // ========================================

    function initTree() {
        if (btnNext4) {
            btnNext4.addEventListener('click', handleNextClick);
            btnNext4.addEventListener('keydown', handleNextKeydown);
        }
    }

    function animateTree() {
        if (scene4Animated) return;
        scene4Animated = true;

        const t = TREE_SEQUENCE;

        // Compress the timeline when reduced motion is enabled
        const rt = (ms) => prefersReducedMotion ? Math.min(ms, 700) : ms;

        // Primary statement fades in
        setTimeout(() => treePrimary.classList.add('visible'), rt(t.primaryDelay));

        // Tree growth begins (soil, seed, roots, trunk, branches, leaves via CSS)
        setTimeout(() => treeStage.classList.add('growing'), rt(t.growReadyDelay));

        // Growing statements reveal as the tree develops
        setTimeout(() => growthLine1.classList.add('visible'), rt(t.line1Delay));
        setTimeout(() => growthLine2.classList.add('visible'), rt(t.line2Delay));
        setTimeout(() => growthLine3.classList.add('visible'), rt(t.line3Delay));
        setTimeout(() => growthLine4.classList.add('visible'), rt(t.line4Delay));

        // Tree becomes fully grown — sway + glow + falling leaves
        setTimeout(() => treeStage.classList.add('grown'), rt(t.grownDelay));

        // Emotional section
        setTimeout(() => emotionalLead.classList.add('visible'), rt(t.leadDelay));
        setTimeout(() => emotionalFocus.classList.add('visible'), rt(t.focusDelay));

        // Next button appears
        setTimeout(() => {
            if (btnNext4) {
                btnNext4.hidden = false;
                btnNext4.offsetHeight;
                btnNext4.classList.add('visible');
            }
        }, rt(t.continueDelay));
    }

    // ========================================
    // PARTICLES SYSTEM (Background)
    // ========================================

    function createParticles() {
        if (prefersReducedMotion) return;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            createParticle(i);
        }
    }

    function createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = random(PARTICLE_MIN_SIZE, PARTICLE_MAX_SIZE);
        const duration = random(PARTICLE_MIN_DURATION, PARTICLE_MAX_DURATION);
        const opacity = random(PARTICLE_MIN_OPACITY, PARTICLE_MAX_OPACITY);
        const left = random(5, 95);
        const delay = random(0, duration * 0.8);

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            --particle-duration: ${duration}ms;
            --particle-opacity: ${opacity};
            animation-delay: ${delay}ms;
        `;

        particlesContainer.appendChild(particle);
        particles.push(particle);
    }

    function pauseParticles() {
        particles.forEach(p => p.style.animationPlayState = 'paused');
    }

    function resumeParticles() {
        particles.forEach(p => p.style.animationPlayState = 'running');
    }

    // ========================================
    // SCENE NAVIGATION
    // ========================================

    function showScene(sceneNumber) {
        if (isTransitioning) return;
        if (sceneNumber < 1 || sceneNumber > TOTAL_SCENES) return;
        if (sceneNumber === currentScene) return;

        isTransitioning = true;

        const currentSceneEl = scenes[currentScene - 1];
        const nextSceneEl = scenes[sceneNumber - 1];

        // Prepare next scene
        nextSceneEl.hidden = false;
        nextSceneEl.classList.add('active');

        // Force reflow for transition
        nextSceneEl.offsetHeight;

        // Animate out current
        currentSceneEl.classList.remove('active');

        // Trigger scene-specific animations
        if (sceneNumber === 2) {
            // Small delay to allow scene to render, then animate classroom
            setTimeout(() => animateClassroom(), 100);
        } else if (sceneNumber === 3) {
            // Small delay to allow scene to render, then animate memory cards
            setTimeout(() => animateMemoryCards(), 100);
        } else if (sceneNumber === 4) {
            // Small delay to allow scene to render, then animate tree growth
            setTimeout(() => animateTree(), 100);
        }

        // Update state after transition
        setTimeout(() => {
            currentSceneEl.hidden = true;
            currentScene = sceneNumber;
            updateProgress();
            updateCounter();
            isTransitioning = false;
        }, 600);
    }

    function nextScene() {
        if (currentScene < TOTAL_SCENES) {
            showScene(currentScene + 1);
        }
    }

    function updateProgress() {
        const progress = (currentScene / TOTAL_SCENES) * 100;
        if (progressBarFill) {
            progressBarFill.style.transform = `scaleX(${progress / 100})`;
        }
        if (progressBarFill) {
            progressBarFill.setAttribute('aria-valuenow', currentScene);
        }
    }

    function updateCounter() {
        if (sceneCounter) {
            sceneCounter.textContent = `${currentScene} / ${TOTAL_SCENES}`;
        }
    }

    // ========================================
    // EVENT BINDING
    // ========================================

    function bindEvents() {
        // Next buttons (Scene 5-7) — Scenes 2, 3, 4 handled by their init functions
        for (let i = 5; i <= TOTAL_SCENES - 1; i++) {
            const btn = document.getElementById(`btn-next-${i}`);
            if (btn) {
                btn.addEventListener('click', handleNextClick);
                btn.addEventListener('keydown', handleNextKeydown);
            }
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleGlobalKeydown);

        // Touch/swipe support
        let touchStartY = 0;
        let touchStartX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;

            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                if (deltaY > 0) {
                    nextScene();
                }
            }
        }, { passive: true });
    }

    function handleNextClick() {
        if (!isTransitioning) {
            nextScene();
        }
    }

    function handleNextKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isTransitioning) {
                nextScene();
            }
        }
    }

    function handleGlobalKeydown(e) {
        if (isTransitioning) return;

        // Arrow keys for navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextScene();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentScene > 1) {
                showScene(currentScene - 1);
            }
        }

        // Number keys 1-8 for direct scene access
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= TOTAL_SCENES && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const activeElement = document.activeElement;
            const isInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;
            if (!isInput) {
                e.preventDefault();
                showScene(num);
            }
        }
    }

    // ========================================
    // UTILITIES
    // ========================================

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // ========================================
    // PUBLIC API (for debugging/testing)
    // ========================================

    window.TeachersDay = {
        showScene,
        nextScene,
        getCurrentScene: () => currentScene,
        getTotalScenes: () => TOTAL_SCENES
    };

    // ========================================
    // START
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();