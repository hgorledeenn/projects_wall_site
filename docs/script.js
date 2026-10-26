const wallContainer = document.getElementById('tile-wall');
const contentContainer = document.querySelector('.container');
const colors = ['#f5e5c3', '#d4ad7e', '#f6dd3f', '#91302b', '#3e6fa0', '#3b5b3f'];

let colorCache = [];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function updateWall() {
  // Clear the container
  wallContainer.innerHTML = '';

  // 1. Add probe tile to let CSS Grid lay out the columns
  const probe = document.createElement('div');
  probe.className = 'tile';
  wallContainer.appendChild(probe);

  // 2. Read the browser's computed grid-template-columns
  const computedStyle = window.getComputedStyle(wallContainer);
  const columnsStyle = computedStyle.getPropertyValue('grid-template-columns');
  const cols = columnsStyle.trim().split(/\s+/).length;

  // 3. Measure rendered tile height and gap
  const tileHeight = probe.getBoundingClientRect().height || 40;
  const gap = parseFloat(computedStyle.getPropertyValue('gap')) || 0;

  // 4. Calculate total scroll height of the entire page content
  // Adding an extra buffer row (+1 or +2) guarantees no empty gaps at the bottom
  const contentHeight = contentContainer ? contentContainer.offsetHeight + contentContainer.offsetTop : 0;
  const totalTargetHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight, contentHeight);

  const rows = Math.ceil(totalTargetHeight / (tileHeight + gap)) + 1;
  const totalTilesNeeded = cols * rows;

  // 5. Expand cache preserving already chosen colors
  while (colorCache.length < totalTilesNeeded) {
    colorCache.push(getRandomColor());
  }

  // 6. Color the probe tile and generate the rest via DocumentFragment
  probe.style.backgroundColor = colorCache[0];

  const fragment = document.createDocumentFragment();
  for (let i = 1; i < totalTilesNeeded; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.style.backgroundColor = colorCache[i];
    fragment.appendChild(tile);
  }

  wallContainer.appendChild(fragment);
}

// Initial build
updateWall();

// Debounce helper to keep updates performant
let debounceTimer;
function debouncedUpdate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(updateWall, 80);
}

// 1. Re-render when browser window resizes
window.addEventListener('resize', debouncedUpdate);

// 2. Re-render whenever collapsible lists/content expand or shrink
if (window.ResizeObserver && contentContainer) {
  const contentObserver = new ResizeObserver(debouncedUpdate);
  contentObserver.observe(contentContainer);
}