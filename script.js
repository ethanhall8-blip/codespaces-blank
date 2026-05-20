const gameCards = document.querySelectorAll('.game-card');
const gameFrame = document.getElementById('gameFrame');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const openTabBtn = document.getElementById('openTabBtn');
const selectedGameTitle = document.getElementById('selected-game');

let currentGameUrl = '';

function loadGame(url, title) {
  currentGameUrl = url;
  gameFrame.src = url;
  selectedGameTitle.textContent = title;
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

gameCards.forEach((card) => {
  card.addEventListener('click', () => {
    const gameUrl = card.dataset.game;
    const title = card.querySelector('h2').textContent;
    loadGame(gameUrl, title);
  });
});

fullscreenBtn.addEventListener('click', () => {
  if (!currentGameUrl) return;
  requestFullscreen();
});

openTabBtn.addEventListener('click', () => {
  if (!currentGameUrl) {
    window.alert('Pick a game first to open it in a new tab.');
  }
});
