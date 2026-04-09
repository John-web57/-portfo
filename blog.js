const blogPosts = {
    'secure-node-api': {
        title: 'Building a Secure Node.js API',
        meta: 'Backend Security · 8 min read',
        content: [
            'Security should be part of the design of a backend from the beginning, not something added later when problems appear.',
            'When I build a Node.js API, I usually start with strong validation. Every request should be checked before it touches the database or any sensitive logic. That reduces bad input, avoids unnecessary processing, and makes the service easier to trust.',
            'I then focus on authentication and authorization. Authentication confirms who the user is, while authorization controls what they are allowed to do. Keeping those responsibilities clear makes route protection simpler and safer.',
            'Logging is also important. Good logs help track suspicious behavior, monitor errors, and improve debugging in production. I prefer logs that are structured enough to support monitoring without exposing sensitive data.',
            'Finally, rate limiting is one of the easiest ways to reduce abuse. It protects the API from brute-force attempts, automated scraping, and accidental traffic spikes. Combined with clean validation and access control, it creates a much stronger backend foundation.'
        ]
    },
    'prompt-engineering': {
        title: 'Prompt Engineering for AI Models',
        meta: 'AI Systems · 6 min read',
        content: [
            'Prompt engineering works best when the goal is clear. Instead of asking for broad answers, I try to define the task, the output format, and the level of detail I want.',
            'One of the most useful techniques is adding constraints. Asking for a summary in bullet points, a JSON structure, or a short explanation for beginners helps the model produce more reliable results.',
            'Examples can also improve consistency. If I show the model the style or structure I want, the output is usually closer to the target on the first attempt.',
            'Iteration matters too. I treat prompts like system design decisions: test, adjust, compare outputs, and keep improving the wording until the response pattern becomes stable.',
            'The goal is not only to get an answer, but to shape a repeatable workflow. That is where prompt engineering becomes valuable in real projects.'
        ]
    },
    'deploy-render': {
        title: 'Deploying an Express App on Render',
        meta: 'Deployment · 7 min read',
        content: [
            'Deploying an Express app is easier when the application is prepared for production before it reaches the hosting platform.',
            'I usually begin by checking environment variables and making sure secrets, API keys, and email credentials are not hardcoded. That keeps the codebase cleaner and makes deployment safer.',
            'The next step is to confirm the app listens on the platform-provided port. Services like Render set the port dynamically, so the backend should always use process.env.PORT with a fallback for local development.',
            'Health checks and logging make deployment smoother. If the app fails to boot, good logs shorten debugging time. If a route should stay available for monitoring, it helps to keep it lightweight and predictable.',
            'After deployment, I review the live app like a user would: load the pages, submit forms, and confirm API endpoints behave as expected. That final pass catches issues that local testing sometimes misses.'
        ]
    }
};

const blogReaderTitle = document.getElementById('blog-reader-title');
const blogReaderMeta = document.getElementById('blog-reader-meta');
const blogReaderContent = document.getElementById('blog-reader-content');
const blogOpenButtons = document.querySelectorAll('.blog-open-post');
const blogFilters = document.querySelectorAll('.blog-filter');
const blogCards = document.querySelectorAll('.blog-post-card');

if (blogReaderTitle && blogReaderMeta && blogReaderContent) {
    const renderPost = (postId) => {
        const post = blogPosts[postId];
        if (!post) {
            return;
        }

        blogReaderTitle.textContent = post.title;
        blogReaderMeta.textContent = post.meta;
        blogReaderContent.innerHTML = post.content.map((paragraph) => `<p>${paragraph}</p>`).join('');
    };

    blogOpenButtons.forEach((button) => {
        button.addEventListener('click', () => {
            renderPost(button.dataset.postId);
            blogReaderTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    blogFilters.forEach((filterButton) => {
        filterButton.addEventListener('click', () => {
            const filter = filterButton.dataset.filter;

            blogFilters.forEach((button) => button.classList.remove('active'));
            filterButton.classList.add('active');

            blogCards.forEach((card) => {
                const categories = card.dataset.category || '';
                const matches = filter === 'all' || categories.includes(filter);
                card.style.display = matches ? '' : 'none';
            });
        });
    });
}
