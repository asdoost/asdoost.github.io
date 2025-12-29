document.addEventListener('DOMContentLoaded', async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // Select DOM elements
    const elements = {
        title: document.querySelector('.post-title'),
        category: document.querySelector('.post-category'),
        date: document.querySelector('.post-date'),
        readTime: document.querySelector('.post-read-time'),
        featuredImage: document.querySelector('.post-featured-image img'),
        content: document.querySelector('.post-content'),
        authorName: document.querySelector('.author-name'),
        authorRole: document.querySelector('.author-role'),
        authorImg: document.querySelector('.author-avatar'),
        tagsContainer: document.querySelector('.post-tags'),
        pageTitle: document.title
    };

    if (!postId) {
        console.error("No post ID specified.");
        return;
    }

    try {
        const response = await fetch(`../data/${postId}.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Populate Basic Elements
        if (elements.title) elements.title.textContent = data.title;
        if (elements.category) elements.category.textContent = data.category;
        if (elements.date) elements.date.textContent = data.date;
        if (elements.readTime) elements.readTime.textContent = data.readTime;

        if (elements.featuredImage && data.image) {
            elements.featuredImage.src = data.image;
            elements.featuredImage.alt = data.title;
        }

        if (elements.authorName) elements.authorName.textContent = data.author;
        if (elements.authorRole) elements.authorRole.textContent = data.authorRole;
        if (elements.authorImg && data.authorImage) elements.authorImg.src = data.authorImage;
        if (elements.content) elements.content.innerHTML = data.content;

        document.title = data.title;

        // ============================================
        // NEW: POPULATE TAGS
        // ============================================
        if (elements.tagsContainer && data.tags && Array.isArray(data.tags)) {
            // Clear existing static tags (if any)
            elements.tagsContainer.innerHTML = '';

            data.tags.forEach(tagText => {
                // Create the span element
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag'; // Must match CSS class

                // Add hash symbol and text
                tagSpan.textContent = `#${tagText}`;

                // Append to container
                elements.tagsContainer.appendChild(tagSpan);
            });
        }

    } catch (error) {
        console.error("Could not load blog post:", error);
    }
});