/**
 * Portfolio Interactive Features
 * - Mobile navigation menu toggle & drawer
 * - Universal Floating AI Assistant Widget with offline fallback
 * - Dynamic Project Filtering & Search
 * - Copy-to-clipboard with toast notifications
 * - Back-to-Top scroll trigger
 */

(function () {
    // --- Mobile Menu Toggle ---
    function initMobileMenu() {
        const toggleBtn = document.querySelector('.mobile-menu-btn');
        const mobileDrawer = document.querySelector('.mobile-nav-drawer');
        const mobileOverlay = document.querySelector('.mobile-nav-overlay');
        const drawerLinks = document.querySelectorAll('.mobile-nav-drawer a');

        if (!toggleBtn || !mobileDrawer) return;

        function openDrawer() {
            toggleBtn.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
            mobileDrawer.classList.add('open');
            if (mobileOverlay) mobileOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeDrawer() {
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            mobileDrawer.classList.remove('open');
            if (mobileOverlay) mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        toggleBtn.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.contains('open');
            if (isOpen) closeDrawer();
            else openDrawer();
        });

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeDrawer);
        }

        drawerLinks.forEach(link => {
            link.addEventListener('click', closeDrawer);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
                closeDrawer();
            }
        });
    }

    // --- Toast Notification ---
    window.showToast = function (message, duration = 3000) {
        let toast = document.querySelector('.portfolio-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'portfolio-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');

        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    };

    // --- Copy to Clipboard ---
    function initCopyButtons() {
        document.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('[data-copy]');
            if (!copyBtn) return;
            const text = copyBtn.getAttribute('data-copy');
            if (!text) return;

            navigator.clipboard.writeText(text).then(() => {
                showToast(`Copied to clipboard: ${text} ✓`);
            }).catch(() => {
                const tempInput = document.createElement('input');
                tempInput.value = text;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast(`Copied to clipboard: ${text} ✓`);
            });
        });
    }

    // --- Back to Top Button ---
    function initBackToTop() {
        const backBtn = document.querySelector('.back-to-top-btn');
        if (!backBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backBtn.classList.add('visible');
            } else {
                backBtn.classList.remove('visible');
            }
        }, { passive: true });

        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Project Filtering (for projects.html) ---
    function initProjectFilters() {
        const filterBtns = document.querySelectorAll('.project-filter-pill');
        const projectCards = document.querySelectorAll('.project-card[data-category]');

        if (!filterBtns.length || !projectCards.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetCategory = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const cardCategories = (card.getAttribute('data-category') || '').split(' ');
                    if (targetCategory === 'all' || cardCategories.includes(targetCategory)) {
                        card.style.display = '';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }

    // --- Floating AI Assistant Widget ---
    function initFloatingAI() {
        // Fallback intelligent responses if backend /api/ai is not reached
        const fallbackAnswers = [
            {
                keywords: ['skill', 'stack', 'technology', 'tools', 'languages', 'frontend', 'backend', 'framework'],
                reply: "John's technical stack spans Programming (Java, Spring Boot, React, JavaScript, HTML/CSS, SQL), Networking (TCP/IP, LAN/WAN, Cisco switches, routers, DNS, DHCP), Cybersecurity (network security, vulnerability assessment), and IT Support (Windows, Linux, printer diagnostics, system administration)."
            },
            {
                keywords: ['attendance', 'cryptafrica', 'work management', 'clock'],
                reply: "John developed the CryptAfrica Staff Attendance & Daily Work Management System using Spring Boot, React, MySQL, and Java. It features employee clock-in/out, time wasted/recovered calculations, leave approvals, asset inventory, and daily work reports."
            },
            {
                keywords: ['education', 'degree', 'university', 'kimathi', 'graduate', 'school'],
                reply: "John is a Bachelor of Science in Information Technology graduate from Dedan Kimathi University of Technology (2026) with specialized Cisco credentials in Networking, Cybersecurity, and IoT, as well as the Huawei Hackathon First Place award."
            },
            {
                keywords: ['project', 'projects', 'portfolio', 'built', 'work'],
                reply: "John's featured projects are: 1) CryptAfrica Staff Attendance & Work Management System, 2) CryptAfrica News Platform, 3) JAYTECH Solutions Company Website, 4) Android Mobile Application, and 5) SMART IoT Environmental Monitoring System."
            },
            {
                keywords: ['contact', 'hire', 'email', 'phone', 'reach', 'whatsapp', 'collaborate', 'available'],
                reply: "John is actively open to IT Support, Systems Administration, and Software Engineering opportunities. You can email him at johnomitijoshua@gmail.com, call/WhatsApp +254 757 824 227, or submit the form on the Contact section."
            },
            {
                keywords: ['cv', 'resume', 'download'],
                reply: "You can download John's official Curriculum Vitae directly using the 'Download CV' button in the hero header or visit the About and Experience pages for detailed career milestones."
            }
        ];

        function getLocalResponse(query) {
            const normalized = query.toLowerCase();
            const matched = fallbackAnswers.find(item =>
                item.keywords.some(k => normalized.includes(k))
            );
            if (matched) return matched.reply;
            return "John is an IT Support Specialist at CryptAfrica and Software Developer with expertise in enterprise systems, networks, cybersecurity, and full-stack web engineering. Ask about his projects, skills, certifications, or how to reach him!";
        }

        const widgetLauncher = document.getElementById('ai-widget-launcher');
        const widgetWindow = document.getElementById('ai-widget-window');
        const widgetClose = document.getElementById('ai-widget-close');
        const widgetForm = document.getElementById('ai-widget-form');
        const widgetInput = document.getElementById('ai-widget-input');
        const widgetMessages = document.getElementById('ai-widget-messages');
        const widgetChips = document.querySelectorAll('.ai-widget-chip');
        const widgetStatus = document.getElementById('ai-widget-status');

        if (!widgetLauncher || !widgetWindow) return;

        function toggleWidget() {
            const isOpen = widgetWindow.classList.contains('open');
            if (isOpen) {
                widgetWindow.classList.remove('open');
                widgetLauncher.setAttribute('aria-expanded', 'false');
            } else {
                widgetWindow.classList.add('open');
                widgetLauncher.setAttribute('aria-expanded', 'true');
                setTimeout(() => widgetInput && widgetInput.focus(), 150);
            }
        }

        widgetLauncher.addEventListener('click', toggleWidget);
        if (widgetClose) {
            widgetClose.addEventListener('click', () => {
                widgetWindow.classList.remove('open');
                widgetLauncher.setAttribute('aria-expanded', 'false');
            });
        }

        function appendMessage(text, sender = 'bot') {
            if (!widgetMessages) return;
            const bubble = document.createElement('div');
            bubble.className = `ai-bubble ${sender === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'}`;
            bubble.innerHTML = `<p>${text}</p>`;
            widgetMessages.appendChild(bubble);
            widgetMessages.scrollTop = widgetMessages.scrollHeight;
        }

        function showTypingIndicator() {
            const typing = document.createElement('div');
            typing.className = 'ai-bubble ai-bubble-bot ai-typing-indicator';
            typing.id = 'ai-typing-temp';
            typing.innerHTML = '<span></span><span></span><span></span>';
            widgetMessages.appendChild(typing);
            widgetMessages.scrollTop = widgetMessages.scrollHeight;
        }

        function removeTypingIndicator() {
            const typing = document.getElementById('ai-typing-temp');
            if (typing) typing.remove();
        }

        async function handleAIQuery(query) {
            if (!query.trim()) return;

            appendMessage(query, 'user');
            if (widgetInput) widgetInput.value = '';
            showTypingIndicator();
            if (widgetStatus) widgetStatus.textContent = 'Thinking...';

            try {
                const res = await fetch('/api/ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: query })
                });

                if (!res.ok) throw new Error('Network response not ok');
                const data = await res.json();
                removeTypingIndicator();
                appendMessage(data.reply || getLocalResponse(query), 'bot');
                if (widgetStatus) widgetStatus.textContent = data.source === 'openai' ? 'Live AI' : 'Active';
            } catch (err) {
                removeTypingIndicator();
                // Graceful instant fallback to intelligent offline assistant
                const reply = getLocalResponse(query);
                appendMessage(reply, 'bot');
                if (widgetStatus) widgetStatus.textContent = 'Assistant Ready';
            }
        }

        if (widgetForm) {
            widgetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (widgetInput) handleAIQuery(widgetInput.value);
            });
        }

        widgetChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const prompt = chip.getAttribute('data-prompt') || chip.textContent;
                handleAIQuery(prompt);
            });
        });
    }

    // --- Universal Contact Form Handling ---
    function initContactForms() {
        const forms = document.querySelectorAll('#contact-form, #contactForm');
        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const statusEl = form.querySelector('#indexFormStatus, #formStatus');
                const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';

                const fromName = form.querySelector('[name="from_name"], #from_name')?.value || '';
                const fromEmail = form.querySelector('[name="from_email"], #from_email')?.value || '';
                const subject = form.querySelector('[name="subject"], #subject')?.value || '';
                const message = form.querySelector('[name="message"], #message')?.value || '';

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending Message...';
                }

                if (statusEl) {
                    statusEl.style.display = 'block';
                    statusEl.style.color = '#eab308';
                    statusEl.textContent = '⏳ Sending your message...';
                }

                try {
                    const res = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            from_name: fromName,
                            from_email: fromEmail,
                            subject: subject,
                            message: message
                        })
                    });

                    const data = await res.json();

                    if (res.ok && data.success) {
                        form.reset();
                        showToast('✓ Message sent successfully! John will reply soon.');
                        if (statusEl) {
                            statusEl.style.color = '#10b981';
                            statusEl.textContent = '✓ Message delivered successfully! Thank you for reaching out.';
                            setTimeout(() => {
                                statusEl.style.display = 'none';
                            }, 6000);
                        }
                    } else {
                        const errMsg = data.error || 'Failed to deliver message. Please email johnomitijoshua@gmail.com directly.';
                        if (statusEl) {
                            statusEl.style.color = '#ef4444';
                            statusEl.textContent = '✗ ' + errMsg;
                        }
                        showToast('✗ ' + errMsg);
                    }
                } catch (err) {
                    if (statusEl) {
                        statusEl.style.color = '#ef4444';
                        statusEl.textContent = '✗ Network error. Please email johnomitijoshua@gmail.com or call +254 757 824 227.';
                    }
                    showToast('✗ Connection error. Please try again.');
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                    }
                }
            });
        });
    }

    // Initialize all components
    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initCopyButtons();
        initBackToTop();
        initProjectFilters();
        initFloatingAI();
        initContactForms();
    });
})();

