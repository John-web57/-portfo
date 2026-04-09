const aiForm = document.getElementById('ai-chat-form');
const aiInput = document.getElementById('ai-user-input');
const aiMessages = document.getElementById('ai-chat-messages');
const aiStatus = document.getElementById('ai-status');
const aiModeNote = document.getElementById('ai-mode-note');
const aiClearButton = document.getElementById('ai-clear-chat');

if (aiForm && aiInput && aiMessages && aiStatus && aiClearButton) {
    const fallbackResponses = [
        {
            keywords: ['skill', 'stack', 'technology', 'technologies', 'tools'],
            reply: 'I work across web development, AI/ML, cybersecurity, and IoT. My portfolio especially emphasizes practical web solutions, intelligent systems, and secure digital products.'
        },
        {
            keywords: ['education', 'study', 'university', 'degree'],
            reply: 'I studied BSc. Information Technology at Dedan Kimathi University of Technology from 2022 to 2026, with Dean\'s List recognition highlighted in my portfolio.'
        },
        {
            keywords: ['project', 'projects', 'build', 'built'],
            reply: 'I build practical web applications and I am especially interested in intelligent systems, cybersecurity-focused solutions, and IoT projects. The Projects and Case Studies pages are the best place to explore specific work.'
        },
        {
            keywords: ['ai', 'machine learning', 'prompt', 'llm'],
            reply: 'AI is one of my core focus areas. I am especially interested in intelligent systems, prompt engineering, and practical AI-driven solutions.'
        },
        {
            keywords: ['hire', 'available', 'freelance', 'internship', 'collaborate', 'contact'],
            reply: 'I am open to internships, freelance work, and collaborations. The fastest next step is through the Contact page if you want to discuss a role or project.'
        }
    ];

    const buildLocalReply = (message) => {
        const normalizedMessage = message.toLowerCase();
        const matchedResponse = fallbackResponses.find((entry) =>
            entry.keywords.some((keyword) => normalizedMessage.includes(keyword))
        );

        if (matchedResponse) {
            return matchedResponse.reply;
        }

        return 'I am an IT graduate and developer focused on web development, AI, cybersecurity, and practical problem-solving. Ask about my projects, tech stack, education, or availability and I will point you in the right direction.';
    };

    const appendMessage = (content, sender) => {
        const message = document.createElement('article');
        message.className = `ai-message ${sender === 'user' ? 'ai-message-user' : 'ai-message-bot'}`;

        const paragraph = document.createElement('p');
        paragraph.textContent = content;
        message.appendChild(paragraph);

        aiMessages.appendChild(message);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    };

    const setStatus = (label) => {
        aiStatus.textContent = label;
    };

    const setModeNote = (label) => {
        if (aiModeNote) {
            aiModeNote.textContent = label;
        }
    };

    aiForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userMessage = aiInput.value.trim();
        if (!userMessage) {
            return;
        }

        appendMessage(userMessage, 'user');
        aiInput.value = '';
        setStatus('Thinking...');

        try {
            if (window.location.protocol === 'file:') {
                throw new Error('Running without a server');
            }

            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'The assistant could not respond right now.');
            }

            appendMessage(data.reply, 'bot');
            setStatus(data.source === 'openai' ? 'Live AI' : 'Portfolio AI');
            setModeNote(
                data.source === 'openai'
                    ? 'Connected to the live AI service.'
                    : 'Using portfolio-aware fallback responses from the server.'
            );
        } catch (error) {
            appendMessage(buildLocalReply(userMessage), 'bot');
            setStatus(window.location.protocol === 'file:' ? 'Offline Demo' : 'Portfolio AI');
            setModeNote(
                window.location.protocol === 'file:'
                    ? 'Offline demo mode: this page is running without the backend server.'
                    : 'Offline demo mode: the API is unavailable, so local portfolio responses are being used.'
            );
        }
    });

    aiClearButton.addEventListener('click', () => {
        aiMessages.innerHTML = `
            <article class="ai-message ai-message-bot">
                <p>
                    Hi, I'm the AI assistant for my portfolio. Ask about my web development work,
                    AI projects, cybersecurity focus, education, or availability for projects.
                </p>
            </article>
        `;
        setStatus('Ready');
        setModeNote('Live mode when connected to the server. Offline demo mode activates automatically if the API is unavailable.');
        aiInput.focus();
    });
}
