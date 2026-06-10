const gameCards = Array.from(document.querySelectorAll('.game-card'));
const gameFrame = document.getElementById('gameFrame');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const openTabBtn = document.getElementById('openTabBtn');
const selectedGameTitle = document.getElementById('selected-game');
const selectedGameDesc = document.getElementById('selected-game-desc');
const selectedGameTags = document.getElementById('selected-game-tags');
const gameSearch = document.getElementById('gameSearch');
const toggleAutoFullscreen = document.getElementById('toggleAutoFullscreen');
const gameCount = document.getElementById('gameCount');

let currentGameUrl = '';
let autoFullscreen = true;

function loadGame(url, title, desc, tags) {
  currentGameUrl = url;
  gameFrame.src = url;
  selectedGameTitle.textContent = title;
  selectedGameDesc.textContent = desc;
  selectedGameTags.innerHTML = '';
  tags.split(',').forEach((tag) => {
    const item = document.createElement('li');
    item.textContent = tag;
    selectedGameTags.appendChild(item);
  });

  fullscreenBtn.disabled = false;
  openTabBtn.href = url;
}

function requestFullscreen() {
  const container = document.getElementById('gameFrameContainer');
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  }
}

function updateAutoFullscreenState() {
  autoFullscreen = localStorage.getItem('ubg4u-auto-fullscreen') !== 'false';
  toggleAutoFullscreen.textContent = `Auto fullscreen: ${autoFullscreen ? 'On' : 'Off'}`;
}

function saveAutoFullscreenState() {
  localStorage.setItem('ubg4u-auto-fullscreen', autoFullscreen);
}

function updateGameCount() {
  const visibleGames = gameCards.filter((card) => !card.classList.contains('hidden'));
  gameCount.textContent = `${visibleGames.length} game${visibleGames.length === 1 ? '' : 's'} available`;
}

function filterGames(query) {
  const normalizedQuery = query.trim().toLowerCase();
  gameCards.forEach((card) => {
    const title = card.dataset.title.toLowerCase();
    const tags = card.dataset.tags.toLowerCase();
    const match = normalizedQuery === '' || title.includes(normalizedQuery) || tags.includes(normalizedQuery);
    card.classList.toggle('hidden', !match);
  });
  updateGameCount();
}

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('ubg4u-favorites') || '[]');
  document.querySelectorAll('.favorite-btn').forEach((button) => {
    const card = button.closest('.game-card');
    const title = card.dataset.title;
    if (favorites.includes(title)) {
      button.classList.add('active');
      button.textContent = '★';
    } else {
      button.classList.remove('active');
      button.textContent = '☆';
    }
  });
}

function toggleFavorite(button) {
  const card = button.closest('.game-card');
  const title = card.dataset.title;
  const favorites = JSON.parse(localStorage.getItem('ubg4u-favorites') || '[]');
  const index = favorites.indexOf(title);
  if (index >= 0) {
    favorites.splice(index, 1);
    button.classList.remove('active');
    button.textContent = '☆';
  } else {
    favorites.push(title);
    button.classList.add('active');
    button.textContent = '★';
  }
  localStorage.setItem('ubg4u-favorites', JSON.stringify(favorites));
}

gameCards.forEach((card) => {
  const favoriteBtn = card.querySelector('.favorite-btn');
  const title = card.dataset.title;
  const desc = card.dataset.desc;
  const tags = card.dataset.tags;

  card.addEventListener('click', () => {
    loadGame(card.dataset.game, title, desc, tags);
    if (autoFullscreen) {
      requestFullscreen();
    }
  });

  favoriteBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleFavorite(favoriteBtn);
  });
});

fullscreenBtn.addEventListener('click', () => {
  if (!currentGameUrl) return;
  requestFullscreen();
});

toggleAutoFullscreen.addEventListener('click', () => {
  autoFullscreen = !autoFullscreen;
  saveAutoFullscreenState();
  updateAutoFullscreenState();
});

openTabBtn.addEventListener('click', (event) => {
  if (!currentGameUrl) {
    event.preventDefault();
    window.alert('Pick a game first to open it in a new tab.');
  }
});

gameSearch.addEventListener('input', (event) => {
  filterGames(event.target.value);
});

window.addEventListener('DOMContentLoaded', () => {
  updateAutoFullscreenState();
  loadFavorites();
  updateGameCount();
});
