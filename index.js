/* ============================================
   NAKANOSEC TOOLS — Application Logic
   ============================================ */

(function () {
    'use strict';

    /* ---- Tools Data ---- */
    var TOOLS = [
        {
            id: 'csrf-generator',
            title: 'CSRF Generator V.1',
            description: 'Generate CSRF proof-of-concept payloads from BurpSuite request data for security testing.',
            url: 'csrf/',
            category: 'Generator',
            icon: '⚡',
            iconClass: 'generator'
        },
        {
            id: 'cors-scanner',
            title: 'CORS Scanner',
            description: 'Discover Cross-Origin Resource Sharing misconfigurations and vulnerabilities in target domains.',
            url: 'cors/',
            category: 'Scanner',
            icon: '🔍',
            iconClass: 'scanner'
        },
        {
            id: 'clickjacking-test',
            title: 'Clickjacking Test',
            description: 'Check if a target website is vulnerable to clickjacking attacks via X-Frame-Options analysis.',
            url: 'cj/',
            category: 'Scanner',
            icon: '🖱️',
            iconClass: 'scanner'
        },
        {
            id: 'curl-to-php',
            title: 'Curl to PHP',
            description: 'Convert cURL commands into clean PHP code for API integration and automation scripts.',
            url: 'curl-to-php/',
            category: 'Converter',
            icon: '🔄',
            iconClass: 'converter'
        },
        {
            id: 'cvss-calculator',
            title: 'CVSS Calculator',
            description: 'Calculate Common Vulnerability Scoring System scores with an interactive graphical interface.',
            url: 'cvss/',
            category: 'Scanner',
            icon: '📊',
            iconClass: 'scanner'
        },
        {
            id: 'jso-generator',
            title: 'JSO Generator',
            description: 'Create JavaScript overlay payloads for testing website defacement scenarios.',
            url: 'jso/',
            category: 'Generator',
            icon: '🎭',
            iconClass: 'generator'
        },
        {
            id: 'crontab-generator',
            title: 'Crontab Generator',
            description: 'Build and validate crontab schedule expressions with an intuitive online interface.',
            url: 'cron/',
            category: 'Generator',
            icon: '⏰',
            iconClass: 'generator'
        },
        {
            id: 'subdomain-scanner',
            title: 'Subdomain Scanner',
            description: 'Enumerate and discover subdomains of a target domain for reconnaissance and penetration testing.',
            url: 'subdo/',
            category: 'Scanner',
            icon: '🌐',
            iconClass: 'scanner'
        },
        {
            id: 'hash-identifier',
            title: 'Hash Identifier',
            description: 'Identify the hashing algorithm used to generate a given hash string (MD5, SHA, bcrypt, etc.).',
            url: 'hash-identifier/',
            category: 'Encoder',
            icon: '#️⃣',
            iconClass: 'encoder'
        },
        {
            id: 'md5-generator',
            title: 'MD5 Online Generator',
            description: 'Generate MD5 hash digests from any input string instantly in your browser.',
            url: 'md5/',
            category: 'Encoder',
            icon: '🔐',
            iconClass: 'encoder'
        },
        {
            id: 'url-encode-decode',
            title: 'URL Encode / Decode',
            description: 'Encode or decode URL-encoded strings for safe HTTP transmission and debugging.',
            url: 'url-encode-decode/',
            category: 'Encoder',
            icon: '🔗',
            iconClass: 'encoder'
        },
        {
            id: 'url-manipulation',
            title: 'URL Manipulation',
            description: 'Batch add or remove HTTP/HTTPS protocols from URL lists for reconnaissance workflows.',
            url: 'url-manipulation/',
            category: 'Converter',
            icon: '🛠️',
            iconClass: 'converter'
        },
        {
            id: 'base64-encode-decode',
            title: 'Base64 Encode / Decode',
            description: 'Encode or decode Base64 strings for data transformation and payload analysis.',
            url: 'base64/',
            category: 'Encoder',
            icon: '📝',
            iconClass: 'encoder'
        },
        {
            id: 'password-generator',
            title: 'Random Password Generator',
            description: 'Generate cryptographically strong random passwords with customizable length and complexity.',
            url: 'password-generator/',
            category: 'Generator',
            icon: '🔑',
            iconClass: 'generator'
        },
        {
            id: 'ds-store-parser',
            title: '.DS_Store Parser',
            description: 'Parse macOS .DS_Store binary files to extract hidden filenames and directory structures for web recon.',
            url: 'ds-store/',
            category: 'Scanner',
            icon: '🗂️',
            iconClass: 'scanner'
        },
        {
            id: 'nmap-builder',
            title: 'Nmap Command Builder',
            description: 'Build complex Nmap scan commands visually with presets for quick, stealth, vuln, and aggressive scans.',
            url: 'nmap/',
            category: 'Generator',
            icon: '🗺️',
            iconClass: 'generator'
        },
        {
            id: 'jwt-debugger',
            title: 'JWT Debugger',
            description: 'Decode, inspect, and encode JSON Web Tokens. Verify HMAC signatures in-browser.',
            url: 'jwt/',
            category: 'Decoder',
            icon: '🔐',
            iconClass: 'decoder'
        },
        {
            id: 'pdf-password',
            title: 'PDF Password Protector',
            description: 'Add password protection to PDF files entirely in-browser. No upload — 100% client-side encryption.',
            url: 'pdf-protect/',
            category: 'Encoder',
            icon: '🔒',
            iconClass: 'encoder'
        }
    ];

    var CATEGORIES = ['All'];
    TOOLS.forEach(function (tool) {
        if (CATEGORIES.indexOf(tool.category) === -1) {
            CATEGORIES.push(tool.category);
        }
    });

    /* ---- DOM References ---- */
    var toolsGrid = document.getElementById('tools-grid');
    var searchInput = document.getElementById('search-input');
    var filterButtons = document.getElementById('filter-buttons');
    var noResults = document.getElementById('no-results');
    var blogGrid = document.getElementById('blog-grid');
    var blogError = document.getElementById('blog-error');
    var mobileToggle = document.getElementById('mobile-nav-toggle');
    var mainNav = document.getElementById('main-nav');

    var activeCategory = 'All';

    /* ---- Sanitize Text ---- */
    function sanitizeText(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[<>"'&]/g, function (ch) {
            var map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
            return map[ch] || ch;
        });
    }

    /* ---- Render Tools ---- */
    function createToolCard(tool) {
        var card = document.createElement('a');
        card.className = 'tool-card reveal';
        card.href = tool.url;
        card.id = 'tool-' + tool.id;

        var header = document.createElement('div');
        header.className = 'tool-card-header';

        var iconEl = document.createElement('div');
        iconEl.className = 'tool-icon ' + tool.iconClass;
        iconEl.textContent = tool.icon;

        var meta = document.createElement('div');
        meta.className = 'tool-card-meta';

        var titleEl = document.createElement('h3');
        titleEl.className = 'tool-card-title';
        titleEl.textContent = tool.title;

        var catEl = document.createElement('span');
        catEl.className = 'tool-card-category';
        catEl.textContent = tool.category;

        meta.appendChild(titleEl);
        meta.appendChild(catEl);
        header.appendChild(iconEl);
        header.appendChild(meta);

        var desc = document.createElement('p');
        desc.className = 'tool-card-description';
        desc.textContent = tool.description;

        var arrow = document.createElement('span');
        arrow.className = 'tool-card-arrow';
        arrow.textContent = 'Open Tool →';

        card.appendChild(header);
        card.appendChild(desc);
        card.appendChild(arrow);

        return card;
    }

    function renderTools(filter, search) {
        toolsGrid.innerHTML = '';
        var searchLower = (search || '').toLowerCase().trim();

        var filtered = TOOLS.filter(function (tool) {
            var matchCat = filter === 'All' || tool.category === filter;
            var matchSearch = !searchLower ||
                tool.title.toLowerCase().indexOf(searchLower) !== -1 ||
                tool.description.toLowerCase().indexOf(searchLower) !== -1 ||
                tool.category.toLowerCase().indexOf(searchLower) !== -1;
            return matchCat && matchSearch;
        });

        if (filtered.length === 0) {
            noResults.hidden = false;
        } else {
            noResults.hidden = true;
            filtered.forEach(function (tool) {
                toolsGrid.appendChild(createToolCard(tool));
            });
            /* trigger reveal for newly rendered cards */
            observeRevealElements();
        }
    }

    /* ---- Render Categories ---- */
    function renderFilters() {
        CATEGORIES.forEach(function (cat) {
            var btn = document.createElement('button');
            btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
            btn.textContent = cat;
            btn.type = 'button';
            btn.id = 'filter-' + cat.toLowerCase();
            btn.addEventListener('click', function () {
                activeCategory = cat;
                var allBtns = filterButtons.querySelectorAll('.filter-btn');
                for (var i = 0; i < allBtns.length; i++) {
                    allBtns[i].classList.remove('active');
                }
                btn.classList.add('active');
                renderTools(activeCategory, searchInput.value);
            });
            filterButtons.appendChild(btn);
        });
    }

    /* ---- Search ---- */
    var searchTimeout;
    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            renderTools(activeCategory, searchInput.value);
        }, 200);
    });

    /* ---- Blog Fetch (Using JSONP to bypass CORS) ---- */
    window.handleBlogPosts = function (data) {
        var entries = data.feed.entry;
        if (!entries || entries.length === 0) {
            showBlogError();
            return;
        }
        blogGrid.innerHTML = '';
        entries.forEach(function (entry) {
            blogGrid.appendChild(createBlogCard(entry));
        });
        observeRevealElements();
    };

    function fetchBlogPosts() {
        var feedUrl = 'https://www.nakanosec.com/feeds/posts/default?alt=json-in-script&callback=handleBlogPosts&max-results=6';
        var script = document.createElement('script');
        script.src = feedUrl;
        script.onerror = function () {
            showBlogError();
        };
        document.body.appendChild(script);
    }

    function createBlogCard(entry) {
        var title = entry.title.$t || 'Untitled';
        var published = entry.published.$t || '';
        var dateStr = formatDate(published);

        /* Get link */
        var link = '#';
        if (entry.link) {
            for (var i = 0; i < entry.link.length; i++) {
                if (entry.link[i].rel === 'alternate') {
                    link = entry.link[i].href;
                    break;
                }
            }
        }

        /* Get excerpt from content or summary */
        var contentRaw = '';
        if (entry.content) {
            contentRaw = entry.content.$t || '';
        } else if (entry.summary) {
            contentRaw = entry.summary.$t || '';
        }
        var excerpt = stripHtml(contentRaw).substring(0, 180) + '...';

        var card = document.createElement('a');
        card.className = 'blog-card reveal';
        card.href = link;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        var dateEl = document.createElement('span');
        dateEl.className = 'blog-card-date';
        dateEl.textContent = dateStr;

        var titleEl = document.createElement('h3');
        titleEl.className = 'blog-card-title';
        titleEl.textContent = title;

        var excerptEl = document.createElement('p');
        excerptEl.className = 'blog-card-excerpt';
        excerptEl.textContent = excerpt;

        var linkEl = document.createElement('span');
        linkEl.className = 'blog-card-link';
        linkEl.textContent = 'Read Article →';

        card.appendChild(dateEl);
        card.appendChild(titleEl);
        card.appendChild(excerptEl);
        card.appendChild(linkEl);

        return card;
    }

    function stripHtml(html) {
        /* Strip HTML tags using regex — safe here because result is only used via textContent */
        var text = html.replace(/<[^>]*>/g, '');
        /* Decode common HTML entities */
        text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
        return text.replace(/\s+/g, ' ').trim();
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            var d = new Date(dateStr);
            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    }

    function showBlogError() {
        blogGrid.innerHTML = '';
        blogError.hidden = false;
    }

    /* ---- Mobile Nav ---- */
    mobileToggle.addEventListener('click', function () {
        var expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', String(!expanded));
        mainNav.classList.toggle('open');
    });

    /* Close mobile nav on link click */
    var navLinks = mainNav.querySelectorAll('.nav-link');
    for (var n = 0; n < navLinks.length; n++) {
        navLinks[n].addEventListener('click', function () {
            mobileToggle.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('open');
        });
    }

    /* ---- Scroll Reveal (Intersection Observer) ---- */
    var revealObserver;
    if ('IntersectionObserver' in window) {
        revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    }

    function observeRevealElements() {
        if (!revealObserver) {
            /* fallback: just show everything */
            var els = document.querySelectorAll('.reveal');
            for (var i = 0; i < els.length; i++) {
                els[i].classList.add('visible');
            }
            return;
        }
        var els = document.querySelectorAll('.reveal:not(.visible)');
        for (var i = 0; i < els.length; i++) {
            revealObserver.observe(els[i]);
        }
    }

    /* ---- Header Scroll Effect ---- */
    var header = document.getElementById('site-header');
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollY > 100) {
            header.style.background = 'rgba(10, 14, 23, 0.95)';
        } else {
            header.style.background = 'rgba(10, 14, 23, 0.8)';
        }
        lastScroll = scrollY;
    }, { passive: true });

    /* ---- Init ---- */
    function init() {
        renderFilters();
        renderTools('All', '');
        fetchBlogPosts();
    }

    init();
})();
