// =============================================
// BLOG ENHANCEMENTS - Progress Bar & Social Share
// =============================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initReadingProgress();
    initShareButtons();
    initCopyLink();
});

// Reading Progress Bar
function initReadingProgress() {
    // Create progress bar if it doesn't exist
    if (!document.querySelector('.reading-progress')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.prepend(progressBar);
    }

    const progressBar = document.querySelector('.reading-progress');
    const article = document.querySelector('article') || document.querySelector('.blog-container');

    if (!article) return;

    window.addEventListener('scroll', function() {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Calculate progress
        const start = articleTop - windowHeight / 2;
        const end = articleTop + articleHeight - windowHeight;
        const progress = Math.min(Math.max((scrollTop - start) / (end - start) * 100, 0), 100);

        progressBar.style.width = progress + '%';
    });
}

// Social Share Buttons
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn[data-share]');

    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const platform = this.dataset.share;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const text = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');

            let shareUrl;

            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${text}`;
                    break;
                case 'reddit':
                    shareUrl = `https://reddit.com/submit?url=${url}&title=${title}`;
                    break;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Copy Link Button
function initCopyLink() {
    const copyButtons = document.querySelectorAll('.share-btn.copy');

    copyButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();

            try {
                await navigator.clipboard.writeText(window.location.href);

                // Visual feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="share-icon">✓</span> <span>Copied!</span>';
                this.classList.add('copied');

                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('copied');
                }, 2000);

            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = window.location.href;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                alert('Link copied to clipboard!');
            }
        });
    });
}

// Create share buttons HTML (can be called to generate buttons)
function createShareButtons() {
    return `
    <div class="share-buttons">
        <span class="share-title">Share this article</span>
        <a href="#" class="share-btn twitter" data-share="twitter">
            <span class="share-icon">𝕏</span>
            <span>Twitter</span>
        </a>
        <a href="#" class="share-btn facebook" data-share="facebook">
            <span class="share-icon">f</span>
            <span>Facebook</span>
        </a>
        <a href="#" class="share-btn linkedin" data-share="linkedin">
            <span class="share-icon">in</span>
            <span>LinkedIn</span>
        </a>
        <a href="#" class="share-btn reddit" data-share="reddit">
            <span class="share-icon">▲</span>
            <span>Reddit</span>
        </a>
        <a href="#" class="share-btn copy">
            <span class="share-icon">🔗</span>
            <span>Copy Link</span>
        </a>
    </div>
    `;
}

// Create sticky sidebar HTML
function createShareSidebar() {
    return `
    <div class="share-sidebar">
        <a href="#" class="share-btn twitter" data-share="twitter" title="Share on Twitter">
            <span class="share-icon">𝕏</span>
        </a>
        <a href="#" class="share-btn facebook" data-share="facebook" title="Share on Facebook">
            <span class="share-icon">f</span>
        </a>
        <a href="#" class="share-btn linkedin" data-share="linkedin" title="Share on LinkedIn">
            <span class="share-icon">in</span>
        </a>
        <a href="#" class="share-btn reddit" data-share="reddit" title="Share on Reddit">
            <span class="share-icon">▲</span>
        </a>
        <a href="#" class="share-btn copy" title="Copy Link">
            <span class="share-icon">🔗</span>
        </a>
    </div>
    `;
}
