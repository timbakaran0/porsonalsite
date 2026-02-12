// Menu toggle functionality
const menuButton = document.getElementById('menuButton');
const navMenu = document.getElementById('navMenu');
const closeMenu = document.getElementById('closeMenu');
const navLinks = document.querySelectorAll('.nav-menu a');

if (menuButton && navMenu && closeMenu) {
    menuButton.addEventListener('click', () => {
        navMenu.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuButton.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Blog loading functionality
let allBlogs = [];
let loadedBlogsCount = 0;
const INITIAL_LOAD = 5;
const LOAD_MORE_COUNT = 3;
let isLoading = false;

// Create blog card HTML
function createBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.style.cursor = 'pointer';
    
    // Make entire card clickable
    card.addEventListener('click', () => {
        window.open(blog.blog_url, '_blank');
    });
    
    card.innerHTML = `
        <div class="blog-image">
            <img src="${blog.image_path}" alt="${blog.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23CD853F%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22white%22%3EBlog Image%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="blog-content">
            <h4 class="blog-title">${blog.title}</h4>
            <p class="blog-excerpt">${blog.description}</p>
        </div>
    `;
    return card;
}

// Load blogs into the container
function loadBlogs(count) {
    if (isLoading || loadedBlogsCount >= allBlogs.length) return;
    
    isLoading = true;
    const blogsWrapper = document.getElementById('blogsWrapper');
    const endIndex = Math.min(loadedBlogsCount + count, allBlogs.length);
    
    for (let i = loadedBlogsCount; i < endIndex; i++) {
        const card = createBlogCard(allBlogs[i]);
        blogsWrapper.appendChild(card);
    }
    
    loadedBlogsCount = endIndex;
    
    // Add "View All" card as the 6th card if there are more than 5 blogs
    if (loadedBlogsCount === 5 && allBlogs.length > 5) {
        const viewAllCard = createViewAllCard();
        blogsWrapper.appendChild(viewAllCard);
    }
    
    isLoading = false;
    
    // Trigger in-view animation after a short delay
    setTimeout(() => {
        blogsWrapper.classList.add('in-view');
    }, 100);
}

// Create View All card (shown as 6th card)
function createViewAllCard() {
    const card = document.createElement('div');
    card.className = 'blog-card view-all-card';
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', () => {
        window.location.href = 'all-blogs.html';
    });
    
    card.innerHTML = `
        <div class="view-all-card-content">
            <i class="fas fa-th-large"></i>
            <h4>View All Blogs</h4>
            <p>Explore all ${allBlogs.length} blog posts</p>
            <span class="view-all-arrow">→</span>
        </div>
    `;
    return card;
}

// Fetch and initialize blogs
async function initializeBlogs() {
    const blogsWrapper = document.getElementById('blogsWrapper');
    
    if (!blogsWrapper) {
        console.error('Blogs wrapper not found');
        return;
    }
    
    try {
        console.log('Fetching blogs from assets/blog.json...');
        const response = await fetch('assets/blog.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('JSON loaded successfully');
        
        // Sort by rank
        allBlogs = data.blogs.sort((a, b) => a.rank - b.rank);
        console.log('Parsed blogs:', allBlogs.length);
        
        if (allBlogs.length === 0) {
            blogsWrapper.innerHTML = '<p style="color: white; text-align: center; padding: 40px;">No blogs available.</p>';
            return;
        }
        
        // Load initial blogs
        loadBlogs(INITIAL_LOAD);
        console.log('Initial blogs loaded');
        
    } catch (error) {
        console.error('Error loading blogs:', error);
        // Show error with more details
        blogsWrapper.innerHTML = `
            <div style="color: white; text-align: center; padding: 40px;">
                <p>Unable to load blogs.</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Error: ${error.message}</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Make sure the assets/blog.json file exists in the correct location.</p>
            </div>
        `;
    }
}

// Initialize blogs on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlogs);
} else {
    initializeBlogs();
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            
            // Animate skill bars when they come into view
            if (entry.target.classList.contains('skill-item')) {
                const progress = entry.target.querySelector('.skill-progress');
                const percentage = progress.getAttribute('data-progress');
                progress.style.setProperty('--progress', percentage + '%');
            }
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll(
    '.who-image, .who-text, .about-me-section, .blogs-wrapper, .skill-item, .skill-badge'
);

animatedElements.forEach(element => {
    observer.observe(element);
});

// Horizontal scroll for blogs
const blogsContainer = document.querySelector('.blogs-scroll-container');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

if (scrollLeftBtn && scrollRightBtn && blogsContainer) {
    scrollLeftBtn.addEventListener('click', () => {
        blogsContainer.scrollBy({
            left: -350,
            behavior: 'smooth'
        });
    });

    scrollRightBtn.addEventListener('click', () => {
        blogsContainer.scrollBy({
            left: 350,
            behavior: 'smooth'
        });
    });

    // Lazy loading on scroll
    blogsContainer.addEventListener('scroll', () => {
        const scrollLeft = blogsContainer.scrollLeft;
        const scrollWidth = blogsContainer.scrollWidth;
        const clientWidth = blogsContainer.clientWidth;
        
        // Load more blogs when scrolled near the end
        if (scrollLeft + clientWidth >= scrollWidth - 300) {
            loadBlogs(LOAD_MORE_COUNT);
        }
        
        // Update arrow visibility
        const maxScroll = scrollWidth - clientWidth;
        if (scrollLeftBtn && scrollRightBtn) {
            scrollLeftBtn.style.opacity = scrollLeft > 0 ? '1' : '0.5';
            scrollRightBtn.style.opacity = scrollLeft < maxScroll - 10 ? '1' : '0.5';
        }
    });

    // Touch/swipe support for mobile
    let isDown = false;
    let startX;
    let scrollLeft;

    blogsContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        blogsContainer.style.cursor = 'grabbing';
        startX = e.pageX - blogsContainer.offsetLeft;
        scrollLeft = blogsContainer.scrollLeft;
    });

    blogsContainer.addEventListener('mouseleave', () => {
        isDown = false;
        blogsContainer.style.cursor = 'grab';
    });

    blogsContainer.addEventListener('mouseup', () => {
        isDown = false;
        blogsContainer.style.cursor = 'grab';
    });

    blogsContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - blogsContainer.offsetLeft;
        const walk = (x - startX) * 2;
        blogsContainer.scrollLeft = scrollLeft - walk;
    });

    // Set cursor style
    blogsContainer.style.cursor = 'grab';
}

// Add hover effect to blog cards (delegated event for dynamic content)
const blogsWrapper = document.getElementById('blogsWrapper');
if (blogsWrapper) {
    blogsWrapper.addEventListener('mouseenter', function(e) {
        if (e.target.classList.contains('blog-card')) {
            e.target.style.transform = 'translateY(-10px)';
        }
    }, true);
    
    blogsWrapper.addEventListener('mouseleave', function(e) {
        if (e.target.classList.contains('blog-card')) {
            e.target.style.transform = 'translateY(0)';
        }
    }, true);
}

// Parallax effect for greeting and hero sections (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const greeting = document.querySelector('.greeting-section');
    const hero = document.querySelector('.hero-section');
    
    if (greeting && scrolled < window.innerHeight) {
        greeting.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (hero && scrolled < window.innerHeight * 2) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add stagger delay to skill items animation
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

// Create placeholder images if they don't exist
function createPlaceholderImages() {
    const images = [
        { id: 'heroAvatar', width: 280, height: 280, text: 'Your Photo' },
        { id: 'seoCube', width: 250, height: 250, text: 'SEO' }
    ];
    
    images.forEach(img => {
        const element = document.getElementById(img.id);
        if (element) {
            element.onerror = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                // Gradient background
                const gradient = ctx.createLinearGradient(0, 0, img.width, img.height);
                gradient.addColorStop(0, '#8B0000');
                gradient.addColorStop(1, '#DC143C');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, img.width, img.height);
                
                // Text
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(img.text, img.width / 2, img.height / 2);
                
                element.src = canvas.toDataURL();
            };
        }
    });
    
    // Create placeholder blog images
    // Blog images are now loaded from CSV, so no placeholders needed
}

// Initialize placeholder images
createPlaceholderImages();

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add active state to social links
const socialLinks = document.querySelectorAll('.social-links-top a, .social-links-bottom a');
socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Add a subtle pulse animation
        link.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            link.style.animation = '';
        }, 300);
    });
});

// Keyboard navigation for blog scroll
document.addEventListener('keydown', (e) => {
    if (blogsContainer) {
        if (e.key === 'ArrowLeft') {
            blogsContainer.scrollBy({
                left: -350,
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowRight') {
            blogsContainer.scrollBy({
                left: 350,
                behavior: 'smooth'
            });
        }
    }
});

// Show/hide scroll arrows based on scroll position
if (blogsContainer) {
    blogsContainer.addEventListener('scroll', () => {
        const scrollLeft = blogsContainer.scrollLeft;
        const maxScroll = blogsContainer.scrollWidth - blogsContainer.clientWidth;
        
        // Update arrow visibility or opacity based on scroll position
        if (scrollLeftBtn && scrollRightBtn) {
            scrollLeftBtn.style.opacity = scrollLeft > 0 ? '1' : '0.5';
            scrollRightBtn.style.opacity = scrollLeft < maxScroll - 10 ? '1' : '0.5';
        }
    });
}

// Add pulse animation keyframe dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

console.log('Portfolio website loaded successfully! 🚀');
