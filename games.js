// ============================================
// GAMES LIBRARY - JavaScript
// ============================================

let allGames = [];
let filteredGames = [];
let currentPage = 1;
const GAMES_PER_PAGE = 12;
let isApiError = false;

// DOM Elements
const gamesGrid = document.getElementById('gamesGrid');
const loadingContainer = document.getElementById('loadingContainer');
const errorContainer = document.getElementById('errorContainer');
const noResults = document.getElementById('noResults');
const gamesCount = document.getElementById('gamesCount');
const countNumber = document.getElementById('countNumber');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const platformFilter = document.getElementById('platformFilter');
const sortFilter = document.getElementById('sortFilter');
const gameModal = document.getElementById('gameModal');

// API URL - Using a CORS proxy for client-side requests
const API_URL = 'https://www.freetogame.com/api/games';
const CORS_PROXY = 'https://corsproxy.io/?';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchGames();
    initEventListeners();
});

// Event Listeners
function initEventListeners() {
    searchInput.addEventListener('input', debounce(filterGames, 300));
    categoryFilter.addEventListener('change', filterGames);
    platformFilter.addEventListener('change', filterGames);
    sortFilter.addEventListener('change', filterGames);
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fetch Games from API
async function fetchGames() {
    showLoading();
    isApiError = false;
    
    try {
        // Try direct API first
        let response;
        try {
            response = await fetch(API_URL);
        } catch (e) {
            // If direct fails, try with CORS proxy
            response = await fetch(CORS_PROXY + encodeURIComponent(API_URL));
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allGames = await response.json();
        filteredGames = [...allGames];
        currentPage = 1;
        
        hideLoading();
        displayGames(filteredGames);
        showGamesCount(filteredGames.length);
        
    } catch (error) {
        console.error('Error fetching games:', error);
        isApiError = true;
        hideLoading();
        showError(error.message);
        
        // Fallback: Show sample data if API fails
        loadSampleData();
    }
}

// Sample data fallback
function loadSampleData() {
    allGames = [
        {
            id: 1,
            title: "Call Of Duty: Warzone",
            thumbnail: "https://www.freetogame.com/g/452/thumbnail.jpg",
            short_description: "A standalone free-to-play battle royale and target extraction modes accessible via Call of Duty: Modern Warfare.",
            game_url: "https://www.freetogame.com/open/call-of-duty-warzone",
            genre: "Shooter",
            platform: "PC (Windows)",
            publisher: "Activision",
            release_date: "2020-03-10"
        },
        {
            id: 2,
            title: "PUBG: BATTLEGROUNDS",
            thumbnail: "https://www.freetogame.com/g/516/thumbnail.jpg",
            short_description: "Get into the action in one of the longest running battle royale games PUBG Battlegrounds.",
            game_url: "https://www.freetogame.com/open/pubg",
            genre: "Shooter",
            platform: "PC (Windows)",
            publisher: "KRAFTON, Inc.",
            release_date: "2022-01-12"
        },
        {
            id: 3,
            title: "Apex Legends",
            thumbnail: "https://www.freetogame.com/g/2/thumbnail.jpg",
            short_description: "A free-to-play strategic battle royale game featuring 60-player matches and team-based play.",
            game_url: "https://www.freetogame.com/open/apex-legends",
            genre: "Shooter",
            platform: "PC (Windows)",
            publisher: "Electronic Arts",
            release_date: "2019-02-04"
        },
        {
            id: 4,
            title: "Fortnite",
            thumbnail: "https://www.freetogame.com/g/33/thumbnail.jpg",
            short_description: "A free-to-play Battle Royale game and target rich sandbox with fun building mechanics.",
            game_url: "https://www.freetogame.com/open/fortnite",
            genre: "Shooter",
            platform: "PC (Windows)",
            publisher: "Epic Games",
            release_date: "2017-07-25"
        },
        {
            id: 5,
            title: "League of Legends",
            thumbnail: "https://www.freetogame.com/g/2/thumbnail.jpg",
            short_description: "One of the most popular MOBAs with a massive player base.",
            game_url: "https://www.freetogame.com/open/league-of-legends",
            genre: "MOBA",
            platform: "PC (Windows)",
            publisher: "Riot Games",
            release_date: "2009-10-27"
        },
        {
            id: 6,
            title: "Valorant",
            thumbnail: "https://www.freetogame.com/g/21/thumbnail.jpg",
            short_description: "A 5v5 character-based tactical FPS from Riot Games.",
            game_url: "https://www.freetogame.com/open/valorant",
            genre: "Shooter",
            platform: "PC (Windows)",
            publisher: "Riot Games",
            release_date: "2020-06-02"
        }
    ];
    
    filteredGames = [...allGames];
    currentPage = 1;
    hideLoading();
    displayGames(filteredGames);
    showGamesCount(filteredGames.length);
}

// Display Games with pagination
function displayGames(games) {
    gamesGrid.innerHTML = '';
    
    // Remove existing load more button and pagination info
    const existingLoadMore = document.querySelector('.load-more-container');
    if (existingLoadMore) existingLoadMore.remove();
    
    if (games.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Calculate pagination
    const startIndex = 0;
    const endIndex = currentPage * GAMES_PER_PAGE;
    const gamesToShow = games.slice(startIndex, endIndex);
    
    gamesToShow.forEach((game, index) => {
        const card = createGameCard(game, index);
        gamesGrid.appendChild(card);
    });
    
    // Add load more button if there are more games
    if (endIndex < games.length) {
        addLoadMoreButton(games.length, endIndex);
    }
    
    // Update games count display
    updateGamesCountDisplay(games.length, endIndex);
}

// Create Game Card
function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card-lib';
    card.style.animationDelay = `${(index % GAMES_PER_PAGE) * 0.08}s`;
    card.onclick = () => openModal(game);
    
    const platformBadge = game.platform?.includes('Browser') ? 'Browser' : 'PC';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${game.thumbnail}" alt="${game.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/365x206/1a1a1a/00ff88?text=No+Image'">
            <div class="card-overlay">
                <button class="card-play-btn" aria-label="عرض تفاصيل ${game.title}">
                    <i class="fas fa-play" aria-hidden="true"></i>
                </button>
            </div>
            <div class="card-badges">
                <span class="card-badge platform">${platformBadge}</span>
            </div>
        </div>
        <div class="card-info">
            <h3 class="card-title">${game.title}</h3>
            <span class="card-genre">${game.genre || 'Game'}</span>
        </div>
    `;
    
    return card;
}

// Add Load More Button
function addLoadMoreButton(totalGames, currentlyShown) {
    const loadMoreContainer = document.createElement('div');
    loadMoreContainer.className = 'load-more-container';
    loadMoreContainer.innerHTML = `
        <button class="load-more-btn" aria-label="تحميل المزيد من الألعاب">
            <i class="fas fa-plus-circle" aria-hidden="true"></i>
            تحميل المزيد
        </button>
    `;
    
    loadMoreContainer.querySelector('.load-more-btn').addEventListener('click', () => {
        currentPage++;
        displayGames(filteredGames);
    });
    
    gamesGrid.parentNode.appendChild(loadMoreContainer);
}

// Update Games Count Display
function updateGamesCountDisplay(totalGames, currentlyShown) {
    const shown = Math.min(currentlyShown, totalGames);
    
    // Check if sample games label should be shown
    if (isApiError) {
        gamesCount.innerHTML = `<span class="sample-label">نماذج من الألعاب المتاحة</span> - عرض <span id="countNumber">${shown}</span> من ${totalGames} لعبة`;
    } else {
        gamesCount.innerHTML = `عرض <span id="countNumber">${shown}</span> من ${totalGames} لعبة`;
    }
}

// Filter Games
function filterGames() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value.toLowerCase();
    const platform = platformFilter.value.toLowerCase();
    const sort = sortFilter.value;
    
    filteredGames = allGames.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || game.genre?.toLowerCase().includes(category);
        const matchesPlatform = !platform || 
            (platform === 'pc' && game.platform?.toLowerCase().includes('windows')) ||
            (platform === 'browser' && game.platform?.toLowerCase().includes('browser'));
        
        return matchesSearch && matchesCategory && matchesPlatform;
    });
    
    // Sort games
    switch (sort) {
        case 'alphabetical':
            filteredGames.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'release-date':
            filteredGames.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            break;
        case 'popularity':
            // Keep original order (assumed to be by popularity)
            break;
        default:
            // Relevance - keep original order
            break;
    }
    
    // Reset pagination when filtering
    currentPage = 1;
    displayGames(filteredGames);
    showGamesCount(filteredGames.length);
}

// Open Modal
function openModal(game) {
    const modal = document.getElementById('gameModal');
    
    document.getElementById('modalImage').src = game.thumbnail;
    document.getElementById('modalImage').alt = game.title;
    document.getElementById('modalTitle').textContent = game.title;
    document.getElementById('modalDescription').textContent = game.short_description || 'لا يوجد وصف متاح';
    document.getElementById('modalGenre').textContent = game.genre || 'غير محدد';
    document.getElementById('modalPlatform').textContent = game.platform || 'غير محدد';
    document.getElementById('modalPublisher').textContent = game.publisher || 'غير محدد';
    document.getElementById('modalRelease').textContent = game.release_date || 'غير محدد';
    document.getElementById('modalLink').href = 'purchase.html';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Show/Hide States
function showLoading() {
    loadingContainer.style.display = 'flex';
    errorContainer.style.display = 'none';
    noResults.style.display = 'none';
    gamesCount.style.display = 'none';
    gamesGrid.innerHTML = '';
    
    // Remove any existing load more button
    const existingLoadMore = document.querySelector('.load-more-container');
    if (existingLoadMore) existingLoadMore.remove();
}

function hideLoading() {
    loadingContainer.style.display = 'none';
}

function showError(errorMessage) {
    const errorText = errorContainer.querySelector('p');
    if (errorText) {
        errorText.textContent = `حدث خطأ: ${errorMessage || 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى'}`;
    }
    errorContainer.style.display = 'block';
}

function hideError() {
    errorContainer.style.display = 'none';
}

function showGamesCount(count) {
    gamesCount.style.display = 'block';
}
