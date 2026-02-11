#!/usr/bin/env node

/**
 * Blog Build System for fabienscritique.club
 *
 * Converts Markdown posts (with YAML frontmatter) from posts/ into
 * HTML blog pages in blog/, updates the blog archive (blog/index.html),
 * and regenerates sitemap.xml and feed.xml.
 *
 * Usage:
 *   npm run build          - Build all posts
 *   npm run build:watch    - Watch for changes (future)
 *
 * Dependencies: marked, gray-matter
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// ============================================================
// Configuration
// ============================================================

const SITE_URL = 'https://fabienscritique.club';
const SITE_TITLE = "Fabien's Critique";
const SITE_DESCRIPTION = 'Honest reviews and authentic experiences. No BS, just real sensations and feelings.';
const SITE_EMAIL = 'fabienscritique@gmail.com';

const POSTS_DIR = path.join(__dirname, 'posts');
const BLOG_DIR = path.join(__dirname, 'blog');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const ROOT_DIR = __dirname;

// ============================================================
// Helpers
// ============================================================

/**
 * Calculate reading time based on word count (~200 words/min).
 */
function calculateReadTime(text) {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

/**
 * Format a date string (YYYY-MM-DD) into a human-readable format.
 * Example: "2025-01-15" -> "January 15, 2025"
 */
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format a date string into RFC 2822 format for RSS feeds.
 * Example: "2025-01-15" -> "Wed, 15 Jan 2025 00:00:00 GMT"
 */
function formatRFC2822(dateStr) {
    const date = new Date(dateStr + 'T00:00:00Z');
    return date.toUTCString();
}

/**
 * Create a URL-friendly slug from a filename.
 * Example: "why-most-reviews-are-garbage.md" -> "why-most-reviews-are-garbage"
 */
function fileToSlug(filename) {
    return path.basename(filename, '.md');
}

/**
 * Truncate text to a given length, breaking at word boundaries.
 */
function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
}

/**
 * Strip HTML tags from a string (for generating plain-text descriptions).
 */
function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Escape XML special characters.
 */
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ============================================================
// Core Build Functions
// ============================================================

/**
 * Parse all Markdown posts from the posts/ directory.
 * Returns an array of post objects sorted by date (newest first).
 */
function parsePosts() {
    if (!fs.existsSync(POSTS_DIR)) {
        console.log('No posts/ directory found. Skipping post generation.');
        return [];
    }

    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

    if (files.length === 0) {
        console.log('No .md files found in posts/. Skipping post generation.');
        return [];
    }

    const posts = files.map(file => {
        const filePath = path.join(POSTS_DIR, file);
        const raw = fs.readFileSync(filePath, 'utf8');
        const { data: frontmatter, content } = matter(raw);

        // Validate required frontmatter
        const required = ['title', 'date', 'category'];
        for (const field of required) {
            if (!frontmatter[field]) {
                console.error(`ERROR: Missing required frontmatter "${field}" in ${file}`);
                process.exit(1);
            }
        }

        const slug = frontmatter.slug || fileToSlug(file);
        const htmlContent = marked.parse(content);
        const plainText = stripHtml(htmlContent);
        const readTime = calculateReadTime(plainText);
        const description = frontmatter.description || truncate(plainText, 160);

        // Normalize date to YYYY-MM-DD string (gray-matter auto-parses dates into Date objects)
        let dateStr = frontmatter.date;
        if (dateStr instanceof Date) {
            dateStr = dateStr.toISOString().split('T')[0];
        } else {
            dateStr = String(dateStr);
        }

        return {
            slug,
            title: frontmatter.title,
            date: dateStr,
            dateFormatted: formatDate(dateStr),
            category: frontmatter.category,
            description,
            tags: frontmatter.tags || [],
            readTime,
            content: htmlContent,
            plainText,
            file
        };
    });

    // Sort by date, newest first
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return posts;
}

/**
 * Render a blog post HTML file from a post object using the template.
 */
function renderPost(post, template) {
    let html = template;

    // Replace all {{placeholder}} tokens
    html = html.replace(/\{\{title\}\}/g, post.title);
    html = html.replace(/\{\{slug\}\}/g, post.slug);
    html = html.replace(/\{\{description\}\}/g, escapeXml(post.description));
    html = html.replace(/\{\{date\}\}/g, post.date);
    html = html.replace(/\{\{dateFormatted\}\}/g, post.dateFormatted);
    html = html.replace(/\{\{category\}\}/g, post.category);
    html = html.replace(/\{\{readTime\}\}/g, String(post.readTime));
    html = html.replace(/\{\{content\}\}/g, post.content);

    return html;
}

/**
 * Generate the blog archive page (blog/index.html).
 * Includes BOTH build-generated posts AND existing hand-crafted posts.
 */
function generateArchive(buildPosts) {
    // Scan blog/ for existing hand-crafted HTML files
    const existingFiles = fs.readdirSync(BLOG_DIR)
        .filter(f => f.endsWith('.html') && f !== 'index.html');

    // Build a set of slugs from our generated posts
    const generatedSlugs = new Set(buildPosts.map(p => p.slug));

    // Collect hand-crafted posts that are NOT from the build system
    const handCraftedPosts = existingFiles
        .filter(f => !generatedSlugs.has(path.basename(f, '.html')))
        .map(file => {
            const filePath = path.join(BLOG_DIR, file);
            const html = fs.readFileSync(filePath, 'utf8');

            // Extract metadata from HTML
            const titleMatch = html.match(/<title>(.*?)\s*\|/);
            const categoryMatch = html.match(/<span class="blog-category">(.*?)<\/span>/);
            const dateMatch = html.match(/<span>(\w+ \d+, \d{4})<\/span>/);
            const descMatch = html.match(/<meta name="description" content="(.*?)"/);
            const readMatch = html.match(/(\d+) min read/);

            return {
                slug: path.basename(file, '.html'),
                title: titleMatch ? titleMatch[1].trim() : path.basename(file, '.html'),
                category: categoryMatch ? categoryMatch[1] : 'General',
                dateFormatted: dateMatch ? dateMatch[1] : 'Unknown',
                date: dateMatch ? parseDateString(dateMatch[1]) : '1970-01-01',
                description: descMatch ? descMatch[1] : '',
                readTime: readMatch ? parseInt(readMatch[1]) : 2,
                isHandCrafted: true
            };
        });

    // Combine and sort all posts by date
    const allPosts = [...buildPosts, ...handCraftedPosts]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Collect unique categories
    const categories = [...new Set(allPosts.map(p => p.category))].sort();

    // Build the card HTML for each post
    const cardsHtml = allPosts.map(post => {
        const categorySlug = post.category.toLowerCase().replace(/\s+/g, '-');
        const excerpt = post.description
            ? truncate(stripHtml(post.description), 120)
            : '';

        return `            <article class="blog-card" data-category="${categorySlug}">
                <div class="blog-card-content">
                    <span class="blog-category">${post.category}</span>
                    <h2><a href="/blog/${post.slug}.html">${post.title}</a></h2>
                    <p class="blog-excerpt">${excerpt}</p>
                    <div class="blog-meta">
                        <span>${post.dateFormatted}</span>
                        <span>${post.readTime} min read</span>
                    </div>
                </div>
            </article>`;
    }).join('\n\n');

    // Build filter buttons
    const filterButtonsHtml = categories.map(cat => {
        const slug = cat.toLowerCase().replace(/\s+/g, '-');
        return `                <button class="filter-btn" data-category="${slug}">${cat}</button>`;
    }).join('\n');

    // Generate the full archive HTML
    const archiveHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Browse all articles from Fabien's Critique - honest insights on theme parks, product reviews, and industry truth.">
    <title>Blog Archive | Fabien's Critique</title>
    <!-- Shared Stylesheets -->
    <link rel="stylesheet" href="../styles/variables.css">
    <link rel="stylesheet" href="../styles/blog-archive.css">
</head>
<body>
    <div class="header">
        <div class="header-content">
            <a href="/" class="back-link">&larr; Back to Home</a>
            <h1>Blog Archive</h1>
            <p class="header-subtitle">All articles from Fabien's Critique</p>
        </div>
    </div>

    <div class="container">
        <!-- Search and Filter -->
        <div class="controls">
            <div class="search-box">
                <input type="text" class="search-input" id="searchInput" placeholder="Search articles...">
            </div>
            <div class="filter-buttons">
                <button class="filter-btn active" data-category="all">All</button>
${filterButtonsHtml}
            </div>
        </div>

        <!-- Blog Grid -->
        <div class="blog-grid" id="blogGrid">
${cardsHtml}
        </div>

        <!-- No Results Message (hidden by default) -->
        <div class="no-results" id="noResults" style="display: none;">
            <h3>No articles found</h3>
            <p>Try adjusting your search or filter criteria.</p>
        </div>
    </div>

    <div class="footer">
        <p>&copy; 2026 Fabien's Critique. All rights reserved.</p>
        <p>No BS. Just Real Experiences.</p>
    </div>

    <script>
        // Search and Filter Functionality
        const searchInput = document.getElementById('searchInput');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const blogGrid = document.getElementById('blogGrid');
        const blogCards = document.querySelectorAll('.blog-card');
        const noResults = document.getElementById('noResults');

        let currentFilter = 'all';

        // Filter by category
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.category;
                filterPosts();
            });
        });

        // Search functionality
        searchInput.addEventListener('input', filterPosts);

        function filterPosts() {
            const searchTerm = searchInput.value.toLowerCase();
            let visibleCount = 0;

            blogCards.forEach(card => {
                const category = card.dataset.category;
                const title = card.querySelector('h2').textContent.toLowerCase();
                const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();

                const matchesCategory = currentFilter === 'all' || category === currentFilter;
                const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);

                if (matchesCategory && matchesSearch) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Show/hide no results message
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    </script>
</body>
</html>`;

    fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), archiveHtml, 'utf8');
    console.log(`  Archive: blog/index.html (${allPosts.length} posts)`);
}

/**
 * Parse a human-readable date string into YYYY-MM-DD.
 * Example: "January 15, 2025" -> "2025-01-15"
 */
function parseDateString(dateStr) {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '1970-01-01';
        return date.toISOString().split('T')[0];
    } catch {
        return '1970-01-01';
    }
}

/**
 * Generate sitemap.xml with all posts.
 */
function generateSitemap(buildPosts) {
    // Static pages (always included)
    const staticPages = [
        { loc: '/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '1.0' },
        { loc: '/blog/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '0.9' },
        { loc: '/privacy.html', lastmod: '2026-01-13', changefreq: 'yearly', priority: '0.3' },
        { loc: '/terms.html', lastmod: '2026-01-13', changefreq: 'yearly', priority: '0.3' },
        { loc: '/cookies.html', lastmod: '2026-01-13', changefreq: 'yearly', priority: '0.3' },
        { loc: '/methodology.html', lastmod: '2026-01-13', changefreq: 'monthly', priority: '0.7' }
    ];

    // Scan existing hand-crafted blog posts
    const existingFiles = fs.readdirSync(BLOG_DIR)
        .filter(f => f.endsWith('.html') && f !== 'index.html');
    const generatedSlugs = new Set(buildPosts.map(p => p.slug));

    const handCraftedEntries = existingFiles
        .filter(f => !generatedSlugs.has(path.basename(f, '.html')))
        .map(file => {
            const filePath = path.join(BLOG_DIR, file);
            const html = fs.readFileSync(filePath, 'utf8');
            const dateMatch = html.match(/<span>(\w+ \d+, \d{4})<\/span>/);
            const date = dateMatch ? parseDateString(dateMatch[1]) : '2025-01-01';

            return {
                loc: `/blog/${file}`,
                lastmod: date,
                changefreq: 'monthly',
                priority: '0.7'
            };
        });

    // Build-generated posts
    const buildEntries = buildPosts.map(post => ({
        loc: `/blog/${post.slug}.html`,
        lastmod: post.date,
        changefreq: 'monthly',
        priority: '0.8'
    }));

    // Combine all entries: static + build + hand-crafted
    const allEntries = [...staticPages, ...buildEntries, ...handCraftedEntries];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(entry => `    <url>
        <loc>${SITE_URL}${entry.loc}</loc>
        <lastmod>${entry.lastmod}</lastmod>
        <changefreq>${entry.changefreq}</changefreq>
        <priority>${entry.priority}</priority>
    </url>`).join('\n')}
</urlset>
`;

    fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), xml, 'utf8');
    console.log(`  Sitemap: sitemap.xml (${allEntries.length} URLs)`);
}

/**
 * Generate feed.xml (RSS 2.0) with all posts.
 */
function generateFeed(buildPosts) {
    // Scan existing hand-crafted blog posts
    const existingFiles = fs.readdirSync(BLOG_DIR)
        .filter(f => f.endsWith('.html') && f !== 'index.html');
    const generatedSlugs = new Set(buildPosts.map(p => p.slug));

    const handCraftedItems = existingFiles
        .filter(f => !generatedSlugs.has(path.basename(f, '.html')))
        .map(file => {
            const filePath = path.join(BLOG_DIR, file);
            const html = fs.readFileSync(filePath, 'utf8');

            const titleMatch = html.match(/<title>(.*?)\s*\|/);
            const descMatch = html.match(/<meta name="description" content="(.*?)"/);
            const categoryMatch = html.match(/<span class="blog-category">(.*?)<\/span>/);
            const dateMatch = html.match(/<span>(\w+ \d+, \d{4})<\/span>/);

            return {
                title: titleMatch ? titleMatch[1].trim() : path.basename(file, '.html'),
                slug: path.basename(file, '.html'),
                date: dateMatch ? parseDateString(dateMatch[1]) : '2025-01-01',
                category: categoryMatch ? categoryMatch[1] : 'General',
                description: descMatch ? descMatch[1] : ''
            };
        });

    // Combine with build posts
    const allItems = [
        ...buildPosts.map(p => ({
            title: p.title,
            slug: p.slug,
            date: p.date,
            category: p.category,
            description: p.description,
            content: p.content
        })),
        ...handCraftedItems
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const now = new Date().toUTCString();

    const itemsXml = allItems.map(item => {
        const url = `${SITE_URL}/blog/${item.slug}.html`;
        const contentHtml = item.content
            ? `<content:encoded><![CDATA[
                ${item.content.substring(0, 500)}
                <p><a href="${url}">Read the full article</a></p>
            ]]></content:encoded>`
            : `<content:encoded><![CDATA[
                <p>${escapeXml(item.description)}</p>
                <p><a href="${url}">Read the full article</a></p>
            ]]></content:encoded>`;

        return `        <item>
            <title>${escapeXml(item.title)}</title>
            <link>${url}</link>
            <guid isPermaLink="true">${url}</guid>
            <pubDate>${formatRFC2822(item.date)}</pubDate>
            <category>${escapeXml(item.category)}</category>
            <description>${escapeXml(item.description)}</description>
            ${contentHtml}
        </item>`;
    }).join('\n\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
        <title>${SITE_TITLE}</title>
        <description>${SITE_DESCRIPTION}</description>
        <link>${SITE_URL}</link>
        <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
        <language>en-us</language>
        <lastBuildDate>${now}</lastBuildDate>
        <managingEditor>${SITE_EMAIL} (Fabien)</managingEditor>
        <webMaster>${SITE_EMAIL} (Fabien)</webMaster>
        <copyright>Copyright 2026 ${SITE_TITLE}</copyright>
        <category>Reviews</category>
        <category>Theme Parks</category>
        <category>Technology</category>
        <ttl>60</ttl>
        <image>
            <url>${SITE_URL}/images/logo.png</url>
            <title>${SITE_TITLE}</title>
            <link>${SITE_URL}</link>
        </image>

${itemsXml}
    </channel>
</rss>
`;

    fs.writeFileSync(path.join(ROOT_DIR, 'feed.xml'), xml, 'utf8');
    console.log(`  Feed: feed.xml (${allItems.length} items)`);
}

// ============================================================
// Main Build Process
// ============================================================

function build() {
    console.log('');
    console.log('=================================');
    console.log("  Fabien's Critique - Blog Build");
    console.log('=================================');
    console.log('');

    // 1. Parse Markdown posts
    console.log('[1/4] Parsing posts...');
    const posts = parsePosts();
    console.log(`  Found ${posts.length} Markdown post(s)`);

    // 2. Render HTML for each post
    if (posts.length > 0) {
        console.log('[2/4] Rendering blog posts...');
        const template = fs.readFileSync(
            path.join(TEMPLATES_DIR, 'blog-post.html'),
            'utf8'
        );

        for (const post of posts) {
            const html = renderPost(post, template);
            const outputPath = path.join(BLOG_DIR, `${post.slug}.html`);
            fs.writeFileSync(outputPath, html, 'utf8');
            console.log(`  -> blog/${post.slug}.html`);
        }
    } else {
        console.log('[2/4] No posts to render (skipping)');
    }

    // 3. Generate blog archive
    console.log('[3/4] Generating archive & feeds...');
    generateArchive(posts);
    generateSitemap(posts);
    generateFeed(posts);

    // 4. Summary
    console.log('');
    console.log('[4/4] Build complete!');

    // Count existing hand-crafted posts
    const existingFiles = fs.readdirSync(BLOG_DIR)
        .filter(f => f.endsWith('.html') && f !== 'index.html');
    const generatedSlugs = new Set(posts.map(p => p.slug));
    const handCrafted = existingFiles.filter(f => !generatedSlugs.has(path.basename(f, '.html')));

    console.log(`  ${posts.length} post(s) built from Markdown`);
    console.log(`  ${handCrafted.length} existing hand-crafted post(s) preserved`);
    console.log(`  ${posts.length + handCrafted.length} total posts in archive`);
    console.log('');
}

// Run
build();
