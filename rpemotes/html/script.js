let currentCategory = null;
let allEmotes = [];
let categories = [];
let showingCategories = true;

// Listen for messages from Lua
window.addEventListener('message', function(event) {
    const data = event.data;
    
    if (data.action === 'openMenu') {
        openMenu(data.categories, data.emotes);
    } else if (data.action === 'closeMenu') {
        closeMenu();
    }
});

// Open menu
function openMenu(cats, emotes) {
    categories = cats || [];
    allEmotes = emotes || [];
    
    const menu = document.getElementById('emote-menu');
    menu.classList.remove('hidden');
    
    // Show categories first
    showingCategories = true;
    renderCategoriesAsCards();
}

// Close menu
function closeMenu() {
    const menu = document.getElementById('emote-menu');
    menu.classList.add('hidden');
    
    // Reset to categories view
    showingCategories = true;
    currentCategory = null;
    
    // Send close event to Lua
    fetch(`https://${GetParentResourceName()}/closeMenu`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
}

// Render categories as cards
function renderCategoriesAsCards() {
    const container = document.getElementById('emotes-grid');
    const searchContainer = document.querySelector('.search-container');
    const categoriesContainer = document.getElementById('categories');
    const searchInput = document.getElementById('search-input');
    
    // Show search on categories screen
    searchContainer.style.display = 'block';
    searchInput.value = '';
    searchInput.placeholder = 'Търси емоут...';
    // searchInput.placeholder = 'Search emote...';
    
    // Hide category buttons
    categoriesContainer.style.display = 'none';
    
    container.innerHTML = '';
    
    // Add "Favorites" category first
    const favoritesCount = allEmotes.filter(e => e.isFavorite).length;
    const favCard = document.createElement('div');
    favCard.className = 'emote-card';
    favCard.innerHTML = `
        <div class="emote-icon">⭐</div>
        <div class="emote-name">Любими</div>
        <div class="emote-description">${favoritesCount} емоута</div>
    `;
    // English version:
    // <div class="emote-name">Favorites</div>
    // <div class="emote-description">${favoritesCount} emotes</div>
    favCard.onclick = () => selectCategory('favorites');
    container.appendChild(favCard);
    
    // Add "All Emotes" category
    const allCard = document.createElement('div');
    allCard.className = 'emote-card';
    allCard.innerHTML = `
        <div class="emote-icon">🎭</div>
        <div class="emote-name">Всички</div>
        <div class="emote-description">${allEmotes.length} емоута</div>
    `;
    // English version:
    // <div class="emote-name">All</div>
    // <div class="emote-description">${allEmotes.length} emotes</div>
    allCard.onclick = () => selectCategory('all');
    container.appendChild(allCard);
    
    // Add other categories
    categories.forEach(cat => {
        const filtered = allEmotes.filter(emote => emote.category === cat.id);
        const card = document.createElement('div');
        card.className = 'emote-card';
        card.innerHTML = `
            <div class="emote-icon">📂</div>
            <div class="emote-name">${cat.name}</div>
            <div class="emote-description">${filtered.length} емоута</div>
        `;
        // English version:
        // <div class="emote-description">${filtered.length} emotes</div>
        card.onclick = () => selectCategory(cat.id);
        container.appendChild(card);
    });
}

// Select category
function selectCategory(categoryId) {
    currentCategory = categoryId;
    showingCategories = false;
    
    const searchContainer = document.querySelector('.search-container');
    const categoriesContainer = document.getElementById('categories');
    const searchInput = document.getElementById('search-input');
    
    // Show search
    searchContainer.style.display = 'block';
    searchInput.value = '';
    searchInput.placeholder = 'Търси емоут...';
    // searchInput.placeholder = 'Search emote...';
    
    // Show back button in categories
    categoriesContainer.style.display = 'flex';
    categoriesContainer.innerHTML = '';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'category-btn active';
    backBtn.textContent = '← Назад';
    // backBtn.textContent = '← Back';
    backBtn.onclick = () => {
        showingCategories = true;
        renderCategoriesAsCards();
    };
    categoriesContainer.appendChild(backBtn);
    
    // Filter and render emotes
    if (categoryId === 'favorites') {
        const favorites = allEmotes.filter(emote => emote.isFavorite);
        renderEmotes(favorites);
    } else if (categoryId === 'all') {
        renderEmotes(allEmotes);
    } else {
        const filtered = allEmotes.filter(emote => emote.category === categoryId);
        renderEmotes(filtered);
    }
}

// Render emotes
function renderEmotes(emotes) {
    const container = document.getElementById('emotes-grid');
    container.innerHTML = '';
    
    if (emotes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 15C8 15 9.5 13 12 13C14.5 13 16 15 16 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="9" cy="9" r="1" fill="currentColor"/>
                    <circle cx="15" cy="9" r="1" fill="currentColor"/>
                </svg>
                <div>Няма намерени емоути</div>
            </div>
        `;
        // English version: <div>No emotes found</div>
        return;
    }
    
    emotes.forEach(emote => {
        const card = document.createElement('div');
        card.className = 'emote-card';
        card.innerHTML = `
            <div class="favorite-star ${emote.isFavorite ? 'active' : ''}" data-emote-id="${emote.id}">⭐</div>
            <div class="emote-icon">${emote.icon || '🎭'}</div>
            <div class="emote-name">${emote.name}</div>
            ${emote.description ? `<div class="emote-description">${emote.description}</div>` : ''}
        `;
        
        // Hover to preview emote with tooltip
        card.onmouseenter = (e) => {
            showPreviewTooltip(e, emote);
            previewEmote(emote);
        };
        
        card.onmouseleave = () => {
            hidePreviewTooltip();
            clearPreview();
        };
        
        // Track mouse movement for tooltip positioning
        card.onmousemove = (e) => {
            updateTooltipPosition(e);
        };
        
        // Click on card to play emote
        card.onclick = (e) => {
            if (!e.target.classList.contains('favorite-star')) {
                selectEmote(emote);
            }
        };
        
        // Click on star to toggle favorite
        const star = card.querySelector('.favorite-star');
        star.onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(emote);
        };
        
        container.appendChild(card);
    });
}

// Show preview tooltip
function showPreviewTooltip(event, emote) {
    const tooltip = document.getElementById('preview-tooltip');
    const nameEl = document.getElementById('preview-name');
    const typeEl = document.getElementById('preview-type');
    
    nameEl.textContent = emote.name;
    typeEl.textContent = emote.category || emote.type;
    
    tooltip.classList.remove('hidden');
    updateTooltipPosition(event);
}

// Hide preview tooltip
function hidePreviewTooltip() {
    const tooltip = document.getElementById('preview-tooltip');
    tooltip.classList.add('hidden');
}

// Update tooltip position
function updateTooltipPosition(event) {
    const tooltip = document.getElementById('preview-tooltip');
    const offset = 20;
    
    // Position to the left of cursor (so ped is visible on the left)
    let x = event.clientX - tooltip.offsetWidth - offset;
    let y = event.clientY - (tooltip.offsetHeight / 2);
    
    // Check if tooltip goes off screen on the left
    if (x < 10) {
        // Position to the right of cursor instead
        x = event.clientX + offset;
    }
    
    // Keep tooltip within vertical bounds
    if (y < 10) y = 10;
    if (y + tooltip.offsetHeight > window.innerHeight) {
        y = window.innerHeight - tooltip.offsetHeight - 10;
    }
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

// Preview emote on hover
function previewEmote(emote) {
    const resourceName = GetParentResourceName();
    
    fetch(`https://${resourceName}/previewEmote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            emoteName: emote.id,
            emoteType: emote.type
        })
    }).catch(err => {
        console.error('Error previewing emote:', err);
    });
}

// Clear preview
function clearPreview() {
    const resourceName = GetParentResourceName();
    
    fetch(`https://${resourceName}/clearPreview`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }).catch(err => {
        console.error('Error clearing preview:', err);
    });
}

// Select emote
function selectEmote(emote) {
    const resourceName = GetParentResourceName();
    console.log('Selecting emote:', emote.id, emote.type);
    console.log('Resource name:', resourceName);
    console.log('Fetch URL:', `https://${resourceName}/selectEmote`);
    
    fetch(`https://${resourceName}/selectEmote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            emoteName: emote.id,
            emoteType: emote.type
        })
    }).then(response => {
        console.log('Response status:', response.status);
        return response.text();
    })
    .then(data => {
        console.log('Response data:', data);
        console.log('Emote selected successfully');
    }).catch(err => {
        console.error('Error selecting emote:', err);
    });
}

// Toggle favorite
function toggleFavorite(emote) {
    const resourceName = GetParentResourceName();
    
    fetch(`https://${resourceName}/toggleFavorite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: emote.id,
            name: emote.name,
            type: emote.type,
            category: emote.category
        })
    }).then(response => response.text())
    .then(data => {
        console.log('Favorite toggled');
        // Update UI
        emote.isFavorite = !emote.isFavorite;
        const star = document.querySelector(`[data-emote-id="${emote.id}"]`);
        if (star) {
            star.classList.toggle('active');
        }
    }).catch(err => {
        console.error('Error toggling favorite:', err);
    });
}

// Search functionality
document.getElementById('search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (showingCategories) {
        // Search in all emotes on categories screen
        if (searchTerm) {
            // Filter emotes by search term
            const filtered = allEmotes.filter(emote => 
                emote.name.toLowerCase().includes(searchTerm) ||
                (emote.description && emote.description.toLowerCase().includes(searchTerm)) ||
                (emote.id && emote.id.toLowerCase().includes(searchTerm))
            );
            
            // Show emotes directly
            renderEmotes(filtered);
        } else {
            // Show categories when search is empty
            renderCategoriesAsCards();
        }
        return;
    }
    
    // Search in emotes when in category view
    let filtered = allEmotes;
    
    // Filter by category if not "all"
    if (currentCategory === 'favorites') {
        filtered = filtered.filter(emote => emote.isFavorite);
    } else if (currentCategory !== 'all') {
        filtered = filtered.filter(emote => emote.category === currentCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(emote => 
            emote.name.toLowerCase().includes(searchTerm) ||
            (emote.description && emote.description.toLowerCase().includes(searchTerm))
        );
    }
    
    renderEmotes(filtered);
});

// Close button
document.getElementById('close-menu').addEventListener('click', closeMenu);

// ESC key to close
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

// Helper function to get resource name
function GetParentResourceName() {
    // Try to get from window location
    if (window.location.href.includes('://nui_')) {
        const parts = window.location.href.split('/');
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].includes('nui_')) {
                return parts[i].replace('nui_', '');
            }
        }
    }
    
    // Fallback to rpemotes
    return 'rpemotes';
}