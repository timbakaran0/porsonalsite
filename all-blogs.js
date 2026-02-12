// Create blog card HTML
function createBlogCard(blog, index) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.cursor = 'pointer';
    
    // Make entire card clickable
    card.addEventListener('click', () => {
        window.open(blog.blog_url, '_blank');
    });
    
    card.innerHTML = `
        <div class="blog-image">
            <img src="${blog.image_path}" alt="${blog.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22220%22%3E%3Crect fill=%22%23CD853F%22 width=%22320%22 height=%22220%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22white%22%3EBlog Image%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="blog-content">
            <h4 class="blog-title">${blog.title}</h4>
            <p class="blog-excerpt">${blog.description}</p>
        </div>
    `;
    return card;
}

// Load all blogs
async function loadAllBlogs() {
    const blogsGrid = document.getElementById('allBlogsGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    try {
        console.log('Fetching blogs from assets/blog.json...');
        const response = await fetch('assets/blog.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('JSON loaded successfully');
        
        // Sort by rank
        const blogs = data.blogs.sort((a, b) => a.rank - b.rank);
        console.log('Parsed blogs:', blogs.length);
        
        // Hide loading spinner
        loadingSpinner.classList.add('hidden');
        
        // Create and append all blog cards
        blogs.forEach((blog, index) => {
            const card = createBlogCard(blog, index);
            blogsGrid.appendChild(card);
        });
        
        // If no blogs found
        if (blogs.length === 0) {
            blogsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No blogs found.</p>';
        }
    } catch (error) {
        console.error('Error loading blogs:', error);
        loadingSpinner.innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 20px;"></i>
                <p style="color: #ff6b6b;">Unable to load blogs.</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Error: ${error.message}</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Make sure the assets/blog.json file exists in the correct location.</p>
            </div>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadAllBlogs);

// Add smooth scroll
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
