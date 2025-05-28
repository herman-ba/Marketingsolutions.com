    document.addEventListener('DOMContentLoaded', () => {
        const sections = [
            document.querySelector('.budget-quality-section'),
            document.querySelector('.direct-communication-section'),
            document.querySelector('.simple-streamlined-section'),
            document.querySelector('.design-som-funker-section')
        ];
        
        const sectionDots = document.querySelectorAll('.section-dot');
        const sectionDotsContainer = document.querySelector('.section-dots-container');
        let lastCurrentSection = 0;
        let isAnimating = false;

        function positionDotsContainer() {
            const startTextSpan = document.querySelector('.text-span-12');
            const startTextBlock = document.querySelector('.text-block-12');
            const endTextBlock1 = document.querySelector('.text-block-22');
            const endTextBlock2 = document.querySelector('.text-block-21');
            
            if (!startTextSpan || !startTextBlock || !endTextBlock1 || !endTextBlock2) return;
            
            const startSpanRect = startTextSpan.getBoundingClientRect();
            const startBlockRect = startTextBlock.getBoundingClientRect();
            const endBlock1Rect = endTextBlock1.getBoundingClientRect();
            const endBlock2Rect = endTextBlock2.getBoundingClientRect();
            
            const startPoint = (startSpanRect.bottom + startBlockRect.bottom) / 2 + window.scrollY;
            const endPoint = (endBlock1Rect.bottom + endBlock2Rect.bottom) / 2 + window.scrollY;
            
            sectionDotsContainer.style.top = `${startPoint}px`;
            sectionDotsContainer.style.height = `${endPoint - startPoint}px`;
        }

        function updateSectionDots() {
            if (isAnimating) return;

            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const currentSection = sections.findIndex(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5;
            });

            if (currentSection === -1) return;

            const isMovingForward = currentSection > lastCurrentSection;

            if (currentSection !== lastCurrentSection) {
                isAnimating = true;
                
                sectionDots.forEach((dot, index) => {
                    if (index < currentSection) {
                        setTimeout(() => {
                            dot.classList.add('completed');
                        }, index * 150); // Stagger the animations
                    } else if (index === currentSection) {
                        setTimeout(() => {
                            dot.classList.add('completed');
                        }, currentSection * 150);
                    } else {
                        dot.classList.remove('completed');
                    }
                });

                setTimeout(() => {
                    isAnimating = false;
                }, currentSection * 150 + 500); // Wait for all animations to complete
            }

            lastCurrentSection = currentSection;
        }

        // Add click handlers to dots
        sectionDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (isAnimating) return;
                sections[index].scrollIntoView({ behavior: 'smooth' });
            });
        });

        window.addEventListener('scroll', () => {
            updateSectionDots();
            positionDotsContainer();
        });
        window.addEventListener('resize', () => {
            updateSectionDots();
            positionDotsContainer();
        });
        
        // Initial setup
        positionDotsContainer();
        updateSectionDots();
    });
        // Sikre at siden alltid starter på toppen ved innlasting
        window.onbeforeunload = function() {
            window.scrollTo(0, 0);
        };
        
        // Sikre at siden alltid starter på toppen selv etter page refresh
        window.addEventListener('load', function() {
            window.scrollTo(0, 0);
        });

        // Loading Screen
        document.addEventListener("DOMContentLoaded", function() {
            // Sikre at siden alltid starter på toppen
            window.scrollTo(0, 0);
            
            const loadingScreen = document.querySelector('.loading-screen');
            const loadingBar = document.querySelector('.loading-bar');
            const customCursor = document.querySelector('.custom-cursor');
            const cascadeElements = document.querySelectorAll('.cascade-reveal');
            
            // Hide all cascade elements initially
            cascadeElements.forEach(el => {
                el.style.transitionDelay = '0s'; // Ensure no initial delay
                el.classList.remove('visible'); // Ensure hidden
            });
            
            // Hide the custom cursor during loading
            if (customCursor) {
                customCursor.style.opacity = "0";
            }
            
            // Set initial progress
            let progress = 0;
            
            // Simulate loading progress
            const simulateProgress = setInterval(function() {
                if (progress < 90) {
                    // Increment by random amount, slowing down as it approaches 90%
                    progress += (90 - progress) / 10 * Math.random();
                    loadingBar.style.width = progress + '%';
                }
            }, 100);
            
            // Actual page load completion
            window.addEventListener('load', function() {
                clearInterval(simulateProgress);
                
                // Complete the progress bar
                progress = 100;
                loadingBar.style.width = '100%';
                
                // Allow animations to complete
                setTimeout(function() {
                    loadingScreen.classList.add('hidden');
                    
                    // Show the custom cursor after loading is complete
                    if (customCursor) {
                        customCursor.style.opacity = "1";
                    }
                    
                    // Begin cascade reveal after loading screen starts to fade
                    setTimeout(() => {
                        const screenWidth = window.innerWidth;
                        const screenHeight = window.innerHeight;
                        // Calculate max diagonal distance for normalization
                        const maxDiagonalDistance = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);
                        const baseDelay = 0.1; // Initial delay after loading screen hides
                        const maxAdditionalDelay = 1.5; // Max time for the wave to cross screen (adjust as needed)
                        
                        cascadeElements.forEach((el) => {
                            const rect = el.getBoundingClientRect();
                            // Calculate direct distance from top-left corner (0,0)
                            const distance = Math.sqrt(rect.left * rect.left + rect.top * rect.top);
                            
                            // Normalize the distance (0 to 1, where 0 is closest to top-left)
                            const normalizedDistance = Math.min(Math.max(distance / maxDiagonalDistance, 0), 1);
                            
                            // Calculate delay: elements further from top-left get more delay
                            const delay = baseDelay + (normalizedDistance * maxAdditionalDelay);
                            
                            el.style.transitionDelay = delay + 's';
                            // Add visible class *after* setting the delay (browser needs a moment)
                            setTimeout(() => {
                                el.classList.add('visible');
                            }, 10); 
                        });
                    }, 100); // Delay after loading screen fade starts
                    
                    // Remove the loading screen from DOM after fade out
                    setTimeout(function() {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }, 500);
                }, 500);
            });
        });
        
        // Background Grid Parallax Effect
        document.addEventListener("DOMContentLoaded", function() {
            const gridPattern = document.querySelector('.grid-pattern');
            if (!gridPattern) return;

            let mouseX = 0;
            let mouseY = 0;
            let currentX = 0;
            let currentY = 0;
            const maxShift = 45; // Increased from 15 for much more movement
            const easeFactor = 0.05; // Smoothing factor

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            function updateBackgroundPosition() {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                // Calculate target offset based on mouse position relative to center
                // Introduce slight non-linearity/randomness with different factors & Math.sin/cos
                const targetX = -((mouseX - centerX) / centerX) * maxShift * (1 + Math.sin(Date.now() * 0.0001) * 0.1); 
                const targetY = -((mouseY - centerY) / centerY) * maxShift * (1 + Math.cos(Date.now() * 0.0001) * 0.1);

                // Smoothly move towards the target position
                currentX += (targetX - currentX) * easeFactor;
                currentY += (targetY - currentY) * easeFactor;

                // Apply the background position
                gridPattern.style.backgroundPosition = `${currentX}px ${currentY}px`;

                requestAnimationFrame(updateBackgroundPosition);
            }

            requestAnimationFrame(updateBackgroundPosition);
        });

        // Load Web Fonts
        WebFont.load({
            google: {
                families: [
                    "Lato:100,100italic,300,300italic,400,400italic,700,700italic,900,900italic",
                    "Open Sans:300,300italic,400,400italic,600,600italic,700,700italic,800,800italic",
                    "Roboto:300,regular,500,600,700",
                    "Roboto Condensed:400,500,600,700",
                    "Rubik:300,regular,500,600",
                    "Heebo:300,regular,500,600",
                    "SF Pro Display:400,500,600,700",
                    "SF Pro Text:400,500,600",
                    "Orbitron:400,500,600,700",
                    "Exo+2:400,500,600,700",
                    "Michroma",
                    "Oxanium:400,500,600,700",
                    "Rajdhani:400,500,600,700",
                    "Russo+One",
                    "Syncopate:400,700",
                    "Julius+Sans+One",
                    "Press+Start+2P",
                    "Anton",
                    "Major+Mono+Display",
                    "Fjalla+One",
                    "Share+Tech"
                ]
            }
        });

        // Navbar Scroll Animation
        document.addEventListener("DOMContentLoaded", function() {
            const logoImage = document.querySelector(".logo-image");
            const logoText = document.querySelector(".logo-text-image");
            const navbar = document.querySelector(".on-scroll-nav-bar-section");
            const wNav = document.querySelector(".w-nav");
            const buttonsNav = document.querySelector(".buttons-nav-bar");
            const langSwitcher = document.querySelector('.language-switcher');
            
            window.addEventListener("scroll", function() {
                const scrollPosition = window.scrollY;
                const maxScroll = 250; // Threshold for animation
                
                // Apply changes based on scroll position
                if (scrollPosition > maxScroll) {
                    navbar.classList.add("scrolled");
                    if (wNav) wNav.classList.add("scrolled");
                    logoImage.classList.add("shrink");
                    logoText.classList.add("shrink");
                    buttonsNav.classList.add("visible");
                    if (langSwitcher) langSwitcher.classList.add("hidden");
                    
                    // Remove any inline background color
                    navbar.style.removeProperty("background-color");
                } else {
                    navbar.classList.remove("scrolled");
                    if (wNav) wNav.classList.remove("scrolled");
                    logoImage.classList.remove("shrink");
                    logoText.classList.remove("shrink");
                    buttonsNav.classList.remove("visible");
                    if (langSwitcher) langSwitcher.classList.remove("hidden");
                    
                    // Ensure background is transparent
                    navbar.style.backgroundColor = "transparent";
                }
            });
        });

        // Custom Cursor
        document.addEventListener("DOMContentLoaded", function() {
            const cursor = document.querySelector(".custom-cursor");
            const loadingScreen = document.querySelector(".loading-screen");
            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let currentX = mouseX;
            let currentY = mouseY;
            let cursorVisible = false;
            
            // Start with cursor hidden
            if (cursor) {
                cursor.style.opacity = "0";
            }

            document.addEventListener("mousemove", function(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                // If cursor is not visible but should be (loading finished), show it
                if (cursor && !cursorVisible && !document.querySelector(".loading-screen")) {
                    cursor.style.opacity = "1";
                    cursorVisible = true;
                }
            });

            function animateCursor() {
                if (!cursor) return;
                
                const speed = 0.05;
                currentX += (mouseX - currentX) * speed;
                currentY += (mouseY - currentY) * speed;

                cursor.style.left = currentX + "px";
                cursor.style.top = currentY + "px";

                requestAnimationFrame(animateCursor);
            }

            animateCursor();

            function toggleHover(e) {
                if (!cursor) return;
                
                if (e.target.closest("a, button, [role='button'], input, select, textarea, .metric-card")) {
                    cursor.classList.add("hover");
                } else {
                    cursor.classList.remove("hover");
                }
            }

            document.addEventListener("mouseover", toggleHover);
            document.addEventListener("mouseout", toggleHover);
        });

        // Progress-based slide system
        document.addEventListener('DOMContentLoaded', () => {
            const section = document.getElementById('scrollSection');
            const container = document.getElementById('cardStack');
            const slides = Array.from(document.querySelectorAll('.scroll-slide'));
            const slideCount = slides.length;
            const vh = window.innerHeight;
            const totalScroll = vh * (slideCount - 1);
            let lastCurrentSlide = 0; // Track the last slide position

            // Create progress dots
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'progress-dots';
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'progress-dot';
                dot.addEventListener('click', () => {
                    window.scrollTo({
                        top: section.offsetTop + (index * vh),
                        behavior: 'smooth'
                    });
                });
                dotsContainer.appendChild(dot);
            });
            container.appendChild(dotsContainer);

            const dots = Array.from(dotsContainer.children);

            function updateSlides() {
                const rect = section.getBoundingClientRect();
                const scrollProgress = Math.min(Math.max(-rect.top / totalScroll, 0), 1);
                const currentSlide = Math.min(Math.floor(scrollProgress * slideCount), slideCount - 1);
                const isMovingForward = currentSlide > lastCurrentSlide;
                
                // Calculate progress within current slide
                const slideProgress = (scrollProgress * slideCount) % 1;
                
                // Show/hide dots based on vertical scroll position
                if (rect.top > 0 || rect.bottom < window.innerHeight) {
                    dotsContainer.classList.add('hidden');
                } else {
                    dotsContainer.classList.remove('hidden');
                }
                
                // Update slides
                slides.forEach((slide, index) => {
                    if (index === currentSlide) {
                        slide.classList.add('active');
                    } else {
                        slide.classList.remove('active');
                    }
                });

                // Update dots with center-outward fill
                dots.forEach((dot, index) => {
                    // Remove the completed class before potentially adding it again
                    dot.classList.remove('completed');
                    
                    if (index < currentSlide) {
                        // Previous slides are fully filled
                        dot.style.setProperty('--size', '100%');
                        
                        // Only add pop effect when moving forward
                        if (isMovingForward && index === currentSlide - 1) {
                            setTimeout(() => {
                                dot.classList.add('completed');
                            }, 50);
                        } else {
                            // No animation for previously completed dots or when moving backward
                            dot.classList.add('completed');
                        }
                    } else if (index === currentSlide) {
                        // Current slide shows progress from center outward
                        const size = slideProgress * 100;
                        dot.style.setProperty('--size', `${size}%`);
                        
                        // If slide is almost complete and moving forward, add the completed class
                        if (slideProgress > 0.95 && isMovingForward) {
                            setTimeout(() => {
                                dot.classList.add('completed');
                            }, 50);
                        }
                    } else {
                        // Future slides are empty
                        dot.style.setProperty('--size', '0%');
                    }
                });
                
                // Update last position for next check
                lastCurrentSlide = currentSlide;
            }

            // Initialize
            slides[0].classList.add('active');
            
            // Event listeners
            window.addEventListener('scroll', updateSlides);
            window.addEventListener('resize', () => {
                const newVh = window.innerHeight;
                const newTotalScroll = newVh * (slideCount - 1);
                updateSlides();
            });

            updateSlides();
        });

        // Start the animation
        updateCursorDot();

        // About Us section interactions
        const aboutUsSection = document.querySelector('.about-us-section');
        const aboutUsImage = document.querySelector('.about-us-image');
        const statItems = document.querySelectorAll('.stat-item');

        // Parallax effect for the about us image
        aboutUsSection.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = aboutUsImage.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            aboutUsImage.style.transform = `
                perspective(1000px)
                rotateY(${x * 5}deg)
                rotateX(${-y * 5}deg)
                translateZ(30px)
            `;
        });

        aboutUsSection.addEventListener('mouseleave', () => {
            aboutUsImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
        });

        // Intersection Observer for stats animation
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }
            });
        }, {
            threshold: 0.2
        });

        // Apply initial state and observe each stat item
        statItems.forEach((item, index) => {
            item.style.transform = 'translateY(30px)';
            item.style.opacity = '0';
            item.style.transition = `all 0.6s ease ${index * 0.2}s`;
            statsObserver.observe(item);
        });

        // Scroll CTA Hide Logic
        document.addEventListener("DOMContentLoaded", function() {
            const scrollCta = document.querySelector('.scroll-cta');
            if (!scrollCta) return;

            // Hide CTA immediately if page is already scrolled (e.g., on refresh)
            if (window.scrollY > 50) {
                scrollCta.classList.add('hidden');
            }

            let hideTimeout;
            window.addEventListener('scroll', function() {
                clearTimeout(hideTimeout);
                // Add hidden class immediately if scrolling starts
                if (window.scrollY > 50) {
                   scrollCta.classList.add('hidden');
                } else {
                   // Optional: Show again if scrolled back to top (debounce might be needed)
                   // scrollCta.classList.remove('hidden');
                }
                
                 // Debounce hiding check slightly if needed, but immediate hide is often preferred
                 /* 
                hideTimeout = setTimeout(() => {
                     if (window.scrollY > 50) {
                         scrollCta.classList.add('hidden');
                     } else {
                         scrollCta.classList.remove('hidden');
                     }
                 }, 50); 
                 */
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const languageButton = document.querySelector('.language-button');
            const languageMenu = document.querySelector('.language-menu');
            const menuItems = languageMenu.querySelectorAll('a');
            const currentLanguage = document.querySelector('.current-language');
            
            // Toggle menu
            languageButton.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                languageMenu.setAttribute('aria-hidden', isExpanded);
            });

            // Handle menu item selection
            menuItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const lang = this.getAttribute('data-lang');
                    currentLanguage.textContent = lang.toUpperCase();
                    
                    // Update aria-current
                    menuItems.forEach(i => i.setAttribute('aria-current', 'false'));
                    this.setAttribute('aria-current', 'true');
                    
                    // Close menu
                    languageButton.setAttribute('aria-expanded', 'false');
                    languageMenu.setAttribute('aria-hidden', 'true');
            });
        });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
                    languageButton.setAttribute('aria-expanded', 'false');
                    languageMenu.setAttribute('aria-hidden', 'true');
                }
            });

            // Handle keyboard navigation
            languageButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });

            menuItems.forEach(item => {
                item.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
        });

        // Translations object
        const translations = {
            'no': {
                'web-design': 'Web-Design',
                'marketing-ai': 'Markedsføring AI',
                'om-oss': 'Om Oss',
                'start-prosjekt': 'Start Prosjekt',
                'kontakt-oss': 'Kontakt Oss',
                'hero-title-1': 'Digital',
                'hero-title-2': 'Web-Design',
                'hero-title-3': 'for',
                'hero-title-4': 'AI',
                'hero-title-5': 'Drevet Fremtid.',
                'hero-subtitle': 'Vi konverterer Besøkende til Kunder. Design som selger',
                'budget-title-1': 'En nettside',
                'budget-title-2': 'du har råd til,',
                'budget-title-3': 'Uten at',
                'budget-title-4': 'Kvaliteten',
                'budget-title-5': 'ryker',
                'budget-text': 'Du skal ikke kaste bort penger. Vi skreddersyr prosjektet så du kun betaler for det du faktisk trenger. Resultatet? En profesjonell løsning som passer ditt budsjett.',
                'direct-title-1': 'Personelig',
                'direct-title-2': 'oppfølging',
                'direct-title-3': '& ekte',
                'direct-title-4': 'engasjement',
                'direct-text': 'Hos oss er du ikke «enda en kunde i rekka». Vi tar oss tid til å skjønne hvem du er og hva du vil oppnå, og svarer kjapt når du lurer på noe – fordi vi oppriktig bryr oss om at du lykkes.',
                'simple-title-1': 'Åpen',
                'simple-title-2': 'og',
                'simple-title-3': 'forutsigbar',
                'simple-title-4': 'prosess',
                'simple-text': 'De fleste vil unngå ubehagelige overraskelser. Vi holder deg oppdatert underveis og sørger for at du føler deg trygg hele veien fra start til lansering.',
                'design-title-1': 'Design som',
                'design-title-2': 'faktisk fungerer',
                'design-title-3': 'for deg & kundene dine',
                'design-text': 'En nettside skal ikke bare være pen, men også gjøre hverdagen enklere for brukerne. Vi skaper design som gir målgruppen din mening, og som tydelig viser hva du tilbyr – slik at besøkende blir værende.',
                'about-title': 'Vi Transformerer Digitale Opplevelser',
                'about-text-1': 'Vi er et team av dedikerte eksperter som brenner for å skape enestående digitale opplevelser. Med vår unike kombinasjon av kreativitet, teknisk ekspertise og strategisk innsikt, hjelper vi bedrifter med å utnytte kraften i moderne webdesign og AI-drevet markedsføring.',
                'about-text-2': 'Vår tilnærming er alltid skreddersydd for hver kunde, med fokus på å levere løsninger som ikke bare ser fantastiske ut, men som også driver resultater og vekst.',
                'about-stat-1': 'Fornøyde kunder',
                'about-stat-2': 'Vellykkede prosjekter',
                'about-stat-3': 'År med magi',
                'performance-metrics': 'Ytelsesmålinger',
                'resource-usage': 'Ressursbruk',
                'server-metrics': 'Server Metrics',
                'metric-load-time': 'lastetid',
                'metric-seo-score': 'SEO-poeng',
                'metric-accessibility': 'tilgjengelighet',
                'metric-first-contentful': 'Første innholdsvisning',
                'metric-cls': 'CLS',
                'metric-total-requests': 'Totale forespørsler',
                'metric-page-size': 'Sidestørrelse',
                'metric-compression': 'Komprimeringsgrad',
                'metric-js-bundle': 'JS Bundle',
                'metric-uptime': 'Oppetid',
                'metric-requests-per-min': 'Forespørsler / min',
                'metric-ttfb': 'Gjennomsnittlig TTFB',
                'hero-start-project': 'Start Prosjekt',
                'hero-contact-us': 'Kontakt Oss'
            },
            'en': {
                'web-design': 'Web Design',
                'marketing-ai': 'Marketing AI',
                'om-oss': 'About Us',
                'start-prosjekt': 'Start Project',
                'kontakt-oss': 'Contact Us',
                'hero-title-1': 'Digital',
                'hero-title-2': 'Web Design',
                'hero-title-3': 'for',
                'hero-title-4': 'AI',
                'hero-title-5': 'Driven Future.',
                'hero-subtitle': 'We Convert Visitors into Customers. Design that Sells',
                'budget-title-1': 'A website',
                'budget-title-2': 'you can afford,',
                'budget-title-3': 'Without',
                'budget-title-4': 'Quality',
                'budget-title-5': 'suffering',
                'budget-text': 'You shouldn\'t waste money. We tailor the project so you only pay for what you actually need. The result? A professional solution that fits your budget.',
                'direct-title-1': 'Personal',
                'direct-title-2': 'follow-up',
                'direct-title-3': '& genuine',
                'direct-title-4': 'engagement',
                'direct-text': 'With us, you\'re not "just another customer in line". We take the time to understand who you are and what you want to achieve, and respond quickly when you have questions – because we genuinely care about your success.',
                'simple-title-1': 'Open',
                'simple-title-2': 'and',
                'simple-title-3': 'predictable',
                'simple-title-4': 'process',
                'simple-text': 'Most people want to avoid unpleasant surprises. We keep you updated throughout the process and ensure you feel secure all the way from start to launch.',
                'design-title-1': 'Design that',
                'design-title-2': 'actually works',
                'design-title-3': 'for you & your customers',
                'design-text': 'A website shouldn\'t just look good, but also make life easier for users. We create designs that give meaning to your target audience and clearly show what you offer – so visitors stay.',
                'about-title': 'We Transform Digital Experiences',
                'about-text-1': 'We are a team of dedicated experts passionate about creating outstanding digital experiences. With our unique combination of creativity, technical expertise, and strategic insight, we help businesses harness the power of modern web design and AI-driven marketing.',
                'about-text-2': 'Our approach is always tailored to each client, focusing on delivering solutions that not only look fantastic but also drive results and growth.',
                'about-stat-1': 'Satisfied clients',
                'about-stat-2': 'Successful projects',
                'about-stat-3': 'Years of magic',
                'performance-metrics': 'Performance Metrics',
                'resource-usage': 'Resource Usage',
                'server-metrics': 'Server Metrics',
                'metric-load-time': 'Load Time',
                'metric-seo-score': 'SEO Score',
                'metric-accessibility': 'Accessibility',
                'metric-first-contentful': 'First Contentful Paint',
                'metric-cls': 'CLS',
                'metric-total-requests': 'Total Requests',
                'metric-page-size': 'Page Size',
                'metric-compression': 'Compression Ratio',
                'metric-js-bundle': 'JS Bundle',
                'metric-uptime': 'Uptime',
                'metric-requests-per-min': 'Requests / min',
                'metric-ttfb': 'Avg TTFB',
                'hero-start-project': 'Start Project',
                'hero-contact-us': 'Contact Us'
            },
            'sv': {
                'web-design': 'Webbdesign',
                'marketing-ai': 'Marknadsföring AI',
                'om-oss': 'Om Oss',
                'start-prosjekt': 'Starta Projekt',
                'kontakt-oss': 'Kontakta Oss',
                'hero-title-1': 'Digital',
                'hero-title-2': 'Webbdesign',
                'hero-title-3': 'för',
                'hero-title-4': 'AI',
                'hero-title-5': 'Driven Framtid.',
                'hero-subtitle': 'Vi Konverterar Besökare till Kunder. Design som Säljer',
                'budget-title-1': 'En webbplats',
                'budget-title-2': 'du har råd med,',
                'budget-title-3': 'Utan att',
                'budget-title-4': 'Kvaliteten',
                'budget-title-5': 'lider',
                'budget-text': 'Du ska inte slösa pengar. Vi skräddarsyr projektet så du bara betalar för det du faktiskt behöver. Resultatet? En professionell lösning som passar din budget.',
                'direct-title-1': 'Personlig',
                'direct-title-2': 'uppföljning',
                'direct-title-3': '& äkta',
                'direct-title-4': 'engagemang',
                'direct-text': 'Hos oss är du inte "bara en kund till". Vi tar oss tid att förstå vem du är och vad du vill uppnå, och svarar snabbt när du har frågor – för att vi verkligen bryr oss om din framgång.',
                'simple-title-1': 'Öppen',
                'simple-title-2': 'och',
                'simple-title-3': 'förutsägbar',
                'simple-title-4': 'process',
                'simple-text': 'De flesta vill undvika obehagliga överraskningar. Vi håller dig uppdaterad under hela processen och säkerställer att du känner dig trygg hela vägen från start till lansering.',
                'design-title-1': 'Design som',
                'design-title-2': 'faktiskt fungerar',
                'design-title-3': 'för dig & dina kunder',
                'design-text': 'En webbplats ska inte bara se bra ut, utan också göra livet enklare för användarna. Vi skapar design som ger mening för din målgrupp och tydligt visar vad du erbjuder – så besökare stannar.',
                'about-title': 'Vi Transformerar Digitala Upplevelser',
                'about-text-1': 'Vi är ett team av dedikerade experter som brinner för att skapa enastående digitala upplevelser. Med vår unika kombination av kreativitet, teknisk expertis och strategisk insikt hjälper vi företag att utnyttja kraften i modern webbdesign och AI-driven marknadsföring.',
                'about-text-2': 'Vårt tillvägagångssätt är alltid skräddarsytt för varje kund, med fokus på att leverera lösningar som inte bara ser fantastiska ut utan också driver resultat och tillväxt.',
                'about-stat-1': 'Nöjda kunder',
                'about-stat-2': 'Framgångsrika projekt',
                'about-stat-3': 'År av magi',
                'performance-metrics': 'Prestandamätningar',
                'resource-usage': 'Resursanvändning',
                'server-metrics': 'Server Metrics',
                'metric-load-time': 'Laddningstid',
                'metric-seo-score': 'SEO-poäng',
                'metric-accessibility': 'Tillgänglighet',
                'metric-first-contentful': 'Första innehållsvisning',
                'metric-cls': 'CLS',
                'metric-total-requests': 'Totalt antal förfrågningar',
                'metric-page-size': 'Sidstorlek',
                'metric-compression': 'Komprimeringsgrad',
                'metric-js-bundle': 'JS Bundle',
                'metric-uptime': 'Drifttid',
                'metric-requests-per-min': 'Förfrågningar / min',
                'metric-ttfb': 'Genomsnittlig TTFB',
                'hero-start-project': 'Starta Projekt',
                'hero-contact-us': 'Kontakta Oss'
            }
        };

        // Language switcher functionality
        document.addEventListener('DOMContentLoaded', function() {
            const langButtons = document.querySelectorAll('.lang-btn');
            
            // Function to update the active state of buttons
            function updateActiveButton(activeLang) {
                langButtons.forEach(btn => {
                    if (btn.dataset.lang === activeLang) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            // Function to translate the page
            function translatePage(lang) {
                const elements = document.querySelectorAll('[data-translate]');
                elements.forEach(element => {
                    const key = element.dataset.translate;
                    if (translations[lang] && translations[lang][key]) {
                        element.textContent = translations[lang][key];
                    }
                });
                
                // Update active button
                updateActiveButton(lang);
                
                // Store the selected language
                localStorage.setItem('selectedLanguage', lang);
            }

            // Add click handlers to language buttons
            langButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const lang = btn.dataset.lang;
                    translatePage(lang);
                });
            });

            // Check for saved language preference
            const savedLang = localStorage.getItem('selectedLanguage');
            if (savedLang) {
                translatePage(savedLang);
            }
        });
        // Initialize translations
        window.translations = {
            'no': {
                // Navigation
                'web-design': 'Web-Design',
                'marketing-ai': 'Markedsføring AI',
                'om-oss': 'Om Oss',
                'start-prosjekt': 'Start Prosjekt',
                'kontakt-oss': 'Kontakt Oss',
                
                // Hero Section
                'hero-title-1': 'Digital',
                'hero-title-2': 'Web-Design',
                'hero-title-3': 'for',
                'hero-title-4': 'AI',
                'hero-title-5': 'Drevet Fremtid.',
                'hero-subtitle': 'Vi konverterer Besøkende til Kunder. Design som selger',
                
                // Budget & Quality Section
                'budget-title-1': 'En nettside',
                'budget-title-2': 'du har råd til,',
                'budget-title-3': 'Uten at',
                'budget-title-4': 'Kvaliteten',
                'budget-title-5': 'ryker',
                'budget-text': 'Du skal ikke kaste bort penger. Vi skreddersyr prosjektet så du kun betaler for det du faktisk trenger. Resultatet? En profesjonell løsning som passer ditt budsjett.',
                
                // Direct Communication Section
                'direct-title-1': 'Personelig',
                'direct-title-2': 'oppfølging',
                'direct-title-3': '& ekte',
                'direct-title-4': 'engasjement',
                'direct-text': 'Hos oss er du ikke «enda en kunde i rekka». Vi tar oss tid til å skjønne hvem du er og hva du vil oppnå, og svarer kjapt når du lurer på noe – fordi vi oppriktig bryr oss om at du lykkes.',
                
                // Simple Streamlined Section
                'simple-title-1': 'Åpen',
                'simple-title-2': 'og',
                'simple-title-3': 'forutsigbar',
                'simple-title-4': 'prosess',
                'simple-text': 'De fleste vil unngå ubehagelige overraskelser. Vi holder deg oppdatert underveis og sørger for at du føler deg trygg hele veien fra start til lansering.',
                
                // Design That Works Section
                'design-title-1': 'Design som',
                'design-title-2': 'faktisk fungerer',
                'design-title-3': 'for deg & kundene dine',
                'design-text': 'En nettside skal ikke bare være pen, men også gjøre hverdagen enklere for brukerne. Vi skaper design som gir målgruppen din mening, og som tydelig viser hva du tilbyr – slik at besøkende blir værende.',
                
                // About Us Section
                'about-title': 'Vi Transformerer Digitale Opplevelser',
                'about-text-1': 'Vi er et team av dedikerte eksperter som brenner for å skape enestående digitale opplevelser. Med vår unike kombinasjon av kreativitet, teknisk ekspertise og strategisk innsikt, hjelper vi bedrifter med å utnytte kraften i moderne webdesign og AI-drevet markedsføring.',
                'about-text-2': 'Vår tilnærming er alltid skreddersydd for hver kunde, med fokus på å levere løsninger som ikke bare ser fantastiske ut, men som også driver resultater og vekst.',
                'about-stat-1': 'Fornøyde kunder',
                'about-stat-2': 'Vellykkede prosjekter',
                'about-stat-3': 'År med magi',
                
                // Performance Metrics
                'performance-metrics': 'Ytelsesmålinger',
                'resource-usage': 'Ressursbruk',
                'server-metrics': 'Server Metrics',
                'metric-load-time': 'lastetid',
                'metric-seo-score': 'SEO-poeng',
                'metric-accessibility': 'tilgjengelighet',
                'metric-first-contentful': 'Første innholdsvisning',
                'metric-cls': 'CLS',
                'metric-total-requests': 'Totale forespørsler',
                'metric-page-size': 'Sidestørrelse',
                'metric-compression': 'Komprimeringsgrad',
                'metric-js-bundle': 'JS Bundle',
                'metric-uptime': 'Oppetid',
                'metric-requests-per-min': 'Forespørsler / min',
                'metric-ttfb': 'Gjennomsnittlig TTFB',
                'hero-start-project': 'Start Prosjekt',
                'hero-contact-us': 'Kontakt Oss'
            },
            'en': {
                // Navigation
                'web-design': 'Web Design',
                'marketing-ai': 'Marketing AI',
                'om-oss': 'About Us',
                'start-prosjekt': 'Start Project',
                'kontakt-oss': 'Contact Us',
                
                // Hero Section
                'hero-title-1': 'Digital',
                'hero-title-2': 'Web Design',
                'hero-title-3': 'for',
                'hero-title-4': 'AI',
                'hero-title-5': 'Driven Future.',
                'hero-subtitle': 'We Convert Visitors into Customers. Design that Sells',
                
                // Budget & Quality Section
                'budget-title-1': 'A website',
                'budget-title-2': 'you can afford,',
                'budget-title-3': 'Without',
                'budget-title-4': 'Quality',
                'budget-title-5': 'suffering',
                'budget-text': 'You shouldn\'t waste money. We tailor the project so you only pay for what you actually need. The result? A professional solution that fits your budget.',
                
                // Direct Communication Section
                'direct-title-1': 'Personal',
                'direct-title-2': 'follow-up',
                'direct-title-3': '& genuine',
                'direct-title-4': 'engagement',
                'direct-text': 'With us, you\'re not "just another customer in line". We take the time to understand who you are and what you want to achieve, and respond quickly when you have questions – because we genuinely care about your success.',
                
                // Simple Streamlined Section
                'simple-title-1': 'Open',
                'simple-title-2': 'and',
                'simple-title-3': 'predictable',
                'simple-title-4': 'process',
                'simple-text': 'Most people want to avoid unpleasant surprises. We keep you updated throughout the process and ensure you feel secure all the way from start to launch.',
                
                // Design That Works Section
                'design-title-1': 'Design that',
                'design-title-2': 'actually works',
                'design-title-3': 'for you & your customers',
                'design-text': 'A website shouldn\'t just look good, but also make life easier for users. We create designs that give meaning to your target audience and clearly show what you offer – so visitors stay.',
                
                // About Us Section
                'about-title': 'We Transform Digital Experiences',
                'about-text-1': 'We are a team of dedicated experts passionate about creating outstanding digital experiences. With our unique combination of creativity, technical expertise, and strategic insight, we help businesses harness the power of modern web design and AI-driven marketing.',
                'about-text-2': 'Our approach is always tailored to each client, focusing on delivering solutions that not only look fantastic but also drive results and growth.',
                'about-stat-1': 'Satisfied clients',
                'about-stat-2': 'Successful projects',
                'about-stat-3': 'Years of magic',
                
                // Performance Metrics
                'performance-metrics': 'Performance Metrics',
                'resource-usage': 'Resource Usage',
                'server-metrics': 'Server Metrics',
                'metric-load-time': 'Load Time',
                'metric-seo-score': 'SEO Score',
                'metric-accessibility': 'Accessibility',
                'metric-first-contentful': 'First Contentful Paint',
                'metric-cls': 'CLS',
                'metric-total-requests': 'Total Requests',
                'metric-page-size': 'Page Size',
                'metric-compression': 'Compression Ratio',
                'metric-js-bundle': 'JS Bundle',
                'metric-uptime': 'Uptime',
                'metric-requests-per-min': 'Requests / min',
                'metric-ttfb': 'Avg TTFB',
                'hero-start-project': 'Start Project',
                'hero-contact-us': 'Contact Us'
            },
            'sv': {
                // Navigation
                'web-design': 'Webbdesign',
                'marketing-ai': 'Marknadsföring AI',
                'om-oss': 'Om Oss',
                'start-prosjekt': 'Starta Projekt',
                'kontakt-oss': 'Kontakta Oss',
                
                // Hero Section
                'hero-title-1': 'Digital',
                'hero-title-2': 'Webbdesign',
                'hero-title-3': 'för',
                'hero-title-4': 'AI',
                'hero-title-5': 'Driven Framtid.',
                'hero-subtitle': 'Vi Konverterar Besökare till Kunder. Design som Säljer',
                
                // Budget & Quality Section
                'budget-title-1': 'En webbplats',
                'budget-title-2': 'du har råd med,',
                'budget-title-3': 'Utan att',
                'budget-title-4': 'Kvaliteten',
                'budget-title-5': 'lider',
                'budget-text': 'Du ska inte slösa pengar. Vi skräddarsyr projektet så du bara betalar för det du faktiskt behöver. Resultatet? En professionell lösning som passar din budget.',
                
                // Direct Communication Section
                'direct-title-1': 'Personlig',
                'direct-title-2': 'uppföljning',
                'direct-title-3': '& äkta',
                'direct-title-4': 'engagemang',
                'direct-text': 'Hos oss är du inte "bara en kund till". Vi tar oss tid att förstå vem du är och vad du vill uppnå, och svarar snabbt när du har frågor – för att vi verkligen bryr oss om din framgång.',
                
                // Simple Streamlined Section
                'simple-title-1': 'Öppen',
                'simple-title-2': 'och',
                'simple-title-3': 'förutsägbar',
                'simple-title-4': 'process',
                'simple-text': 'De flesta vill undvika obehagliga överraskningar. Vi håller dig uppdaterad under hela processen och säkerställer att du känner dig trygg hela vägen från start till lansering.',
                
                // Design That Works Section
                'design-title-1': 'Design som',
                'design-title-2': 'faktiskt fungerar',
                'design-title-3': 'för dig & dina kunder',
                'design-text': 'En webbplats ska inte bara se bra ut, utan också göra livet enklare för användarna. Vi skapar design som ger mening för din målgrupp och tydligt visar vad du erbjuder – så besökare stannar.',
                
                // About Us Section
                'about-title': 'Vi Transformerar Digitala Upplevelser',
                'about-text-1': 'Vi är ett team av dedikerade experter som brinner för att skapa enastående digitala upplevelser. Med vår unika kombination av kreativitet, teknisk expertis och strategisk insikt hjälper vi företag att utnyttja kraften i modern webbdesign och AI-driven marknadsföring.',
                'about-text-2': 'Vårt tillvägagångssätt är alltid skräddarsytt för varje kund, med fokus på att leverera lösningar som inte bara ser fantastiska ut utan också driver resultat och tillväxt.',
                'about-stat-1': 'Nöjda kunder',
                'about-stat-2': 'Framgångsrika projekt',
                'about-stat-3': 'År av magi',
                
                // Performance Metrics
                'performance-metrics': 'Prestandamätningar',
                'resource-usage': 'Resursanvändning',
                'server-metrics': 'Server Metrics',
                'metric-load-time': 'Laddningstid',
                'metric-seo-score': 'SEO-poäng',
                'metric-accessibility': 'Tillgänglighet',
                'metric-first-contentful': 'Första innehållsvisning',
                'metric-cls': 'CLS',
                'metric-total-requests': 'Totalt antal förfrågningar',
                'metric-page-size': 'Sidstorlek',
                'metric-compression': 'Komprimeringsgrad',
                'metric-js-bundle': 'JS Bundle',
                'metric-uptime': 'Drifttid',
                'metric-requests-per-min': 'Förfrågningar / min',
                'metric-ttfb': 'Genomsnittlig TTFB',
                'hero-start-project': 'Starta Projekt',
                'hero-contact-us': 'Kontakta Oss'
            }
        };

        // Language switcher functionality
        document.addEventListener('DOMContentLoaded', function() {
            const langButtons = document.querySelectorAll('.lang-btn');

            // Function to update the active state of buttons
            function updateActiveButton(activeLang) {
                langButtons.forEach(btn => {
                    if (btn.dataset.lang === activeLang) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            // Function to translate the page
            function translatePage(lang) {
                const elements = document.querySelectorAll('[data-translate]');
                elements.forEach(element => {
                    const key = element.dataset.translate;
                    if (window.translations[lang] && window.translations[lang][key]) {
                        element.textContent = window.translations[lang][key];
                    }
                });
                
                // Update active button
                updateActiveButton(lang);

                // Store the selected language
                localStorage.setItem('selectedLanguage', lang);
            }

            // Add click handlers to language buttons
            langButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const lang = btn.dataset.lang;
                    translatePage(lang);
                });
            });

            // Check for saved language preference
            const savedLang = localStorage.getItem('selectedLanguage');
            if (savedLang) {
                translatePage(savedLang);
            }
        });
