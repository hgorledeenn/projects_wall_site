const container = document.getElementById('tile-wall');
const colors = ['#f2e0ba', '#cda675', '#fad93d', '#732824', '#375777', '#334b36'];

let colorCache = [];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function updateWall() {
  // Clear the container
  container.innerHTML = '';

  // 1. Add a single test tile to let CSS Grid lay out the columns
  const probe = document.createElement('div');
  probe.className = 'tile';
  container.appendChild(probe);

  // 2. Read the browser's computed grid-template-columns (e.g. "42px 42px 42px...")
  const computedStyle = window.getComputedStyle(container);
  const columnsStyle = computedStyle.getPropertyValue('grid-template-columns');
  const cols = columnsStyle.trim().split(/\s+/).length;

  // 3. Measure the actual rendered height of the tile (includes aspect-ratio)
  const tileHeight = probe.getBoundingClientRect().height || 40;
  const gap = parseFloat(computedStyle.getPropertyValue('gap')) || 0;

  // 4. Calculate total rows and tiles needed to fill the screen
  const rows = Math.ceil(window.innerHeight / (tileHeight + gap)) + 1;
  const totalTilesNeeded = cols * rows;

  // 5. Expand cache if viewport grew, preserving existing tile colors
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

  container.appendChild(fragment);
}

// Initial build
updateWall();

// Debounced resize listener
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateWall, 100);
});







