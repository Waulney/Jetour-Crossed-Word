// 20 Niveaux automobiles dédiés à Jetour (Modèles en lettres, logiciels, équipements, jargon du voyage) adaptés pour une grille 10x10
const LEVELS = [
    { title: "Level 1: Flagship Series", words: ["FLASH", "SERIES", "CRUISE", "SUV", "PLUS"] },
    { title: "Level 2: Traveller & Off-Road", words: ["TRAIL", "CAMP", "ROOF", "GEAR", "RIDE"] },
    { title: "Level 3: Travel+ Philosophy", words: ["TRIP", "TOUR", "ROAD", "MAP", "GO"] },
    { title: "Level 4: Under the Hood (Hardware)", words: ["MOTOR", "TURBO", "VALVE", "PISTON", "AXLE"] },
    { title: "Level 5: Powertrain & Transmission", words: ["GEAR", "DRIVE", "AUTO", "POWER", "SPEED"] },
    { title: "Level 6: Wheels & Brakes", words: ["WHEEL", "TIRE", "BRAKE", "DISC", "ABS"] },
    { title: "Level 7: Smart Software & Tech", words: ["SYNC", "APPS", "MAPS", "AI", "CLOUD"] },
    { title: "Level 8: Cockpit & Display", words: ["SCREEN", "AUDIO", "DASH", "VOICE", "HUD"] },
    { title: "Level 9: Cabin & Comfort", words: ["SEAT", "SPACE", "LEATHER", "ROOF", "AIR"] },
    { title: "Level 10: Exterior Design", words: ["GRILL", "LIGHT", "PAINT", "DOOR", "GLASS"] },
    { title: "Level 11: Safety & Sensors", words: ["RADAR", "CAMERA", "ALARM", "SENSE", "SAFE"] },
    { title: "Level 12: Suspension & Ride", words: ["SHOCK", "SPRING", "RIDE", "FLEX", "GRIP"] },
    { title: "Level 13: Fuel & Energy", words: ["GAS", "TANK", "FUEL", "PUMP", "ECO"] },
    { title: "Level 14: Lighting & Vision", words: ["LED", "BEAM", "LAMP", "BULB", "VIEW"] },
    { title: "Level 15: Storage & Utility", words: ["RACK", "BOX", "LOAD", "TOW", "HOOK"] },
    { title: "Level 16: Performance & Speed", words: ["SPEED", "TURBO", "TRACK", "RUN", "FAST"] },
    { title: "Level 17: Quality & Build", words: ["STEEL", "BODY", "TEST", "PART", "BUILD"] },
    { title: "Level 18: Maintenance & Care", words: ["OIL", "WIPER", "CHECK", "PLUG", "CARE"] },
    { title: "Level 19: Adventure Lifestyle", words: ["WILD", "HILL", "SAND", "MUD", "PARK"] },
    { title: "Level 20: Ultimate Jetour", words: ["JETOUR", "TRAVEL", "FUTURE", "DRIVE", "START"] }
];

let currentLevelIndex = 0;
let grid = [];
let placedWords = [];
let foundWords = new Set();
let selectedCells = [];
let isInteracting = false;
let startCell = null;

const GRID_SIZE = 10;

document.addEventListener('DOMContentLoaded', () => {
    initLevel(currentLevelIndex);

    document.getElementById('themeToggleBtn').addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        const btn = document.getElementById('themeToggleBtn');
        btn.innerText = document.body.classList.contains('theme-dark') ? '☀️' : '🌙';
    });

    document.getElementById('nextLevelBtn').addEventListener('click', () => {
        document.getElementById('levelModal').classList.add('hidden');
        currentLevelIndex++;
        if (currentLevelIndex >= LEVELS.length) {
            currentLevelIndex = 0;
        }
        initLevel(currentLevelIndex);
    });

    window.addEventListener('mouseup', endSelection);
    window.addEventListener('touchend', endSelection);
});

function initLevel(levelIdx) {
    const levelData = LEVELS[levelIdx];
    
    document.getElementById('levelDisplay').innerText = `Level ${levelIdx + 1} / ${LEVELS.length}`;
    document.getElementById('levelThemeTitle').innerText = levelData.title;
    
    foundWords.clear();
    generateGrid(levelData.words);
    renderWordList(levelData.words);
    renderGrid();
}

function generateGrid(words) {
    grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    placedWords = [];

    words.forEach(word => {
        let placed = false;
        let attempts = 0;
        const cleanWord = word.replace(/[^A-Z]/g, '');

        while (!placed && attempts < 100) {
            attempts++;
            const direction = Math.floor(Math.random() * 3); // 0: Horizontal, 1: Vertical, 2: Diagonal
            let row = Math.floor(Math.random() * GRID_SIZE);
            let col = Math.floor(Math.random() * GRID_SIZE);

            if (canPlaceWord(cleanWord, row, col, direction)) {
                placeWord(cleanWord, row, col, direction);
                placedWords.push({ word: cleanWord, coords: getWordCoords(cleanWord, row, col, direction) });
                placed = true;
            }
        }
    });

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
}

function canPlaceWord(word, row, col, dir) {
    const len = word.length;
    if (dir === 0 && col + len > GRID_SIZE) return false;
    if (dir === 1 && row + len > GRID_SIZE) return false;
    if (dir === 2 && (col + len > GRID_SIZE || row + len > GRID_SIZE)) return false;

    for (let i = 0; i < len; i++) {
        let r = row + (dir === 1 || dir === 2 ? i : 0);
        let c = col + (dir === 0 || dir === 2 ? i : 0);
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
            return false;
        }
    }
    return true;
}

function placeWord(word, row, col, dir) {
    for (let i = 0; i < word.length; i++) {
        let r = row + (dir === 1 || dir === 2 ? i : 0);
        let c = col + (dir === 0 || dir === 2 ? i : 0);
        grid[r][c] = word[i];
    }
}

function getWordCoords(word, row, col, dir) {
    let coords = [];
    for (let i = 0; i < word.length; i++) {
        let r = row + (dir === 1 || dir === 2 ? i : 0);
        let c = col + (dir === 0 || dir === 2 ? i : 0);
        coords.push(`${r}-${c}`);
    }
    return coords;
}

function renderGrid() {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.innerText = grid[r][c];

            cell.addEventListener('mousedown', (e) => { e.preventDefault(); startSelection(r, c); });
            cell.addEventListener('mouseenter', () => { if (isInteracting) updateSelection(r, c); });

            cell.addEventListener('touchstart', (e) => {
                e.preventDefault();
                startSelection(r, c);
            }, { passive: false });

            cell.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (!isInteracting) return;
                const touch = e.touches[0];
                const target = document.elementFromPoint(touch.clientX, touch.clientY);
                if (target && target.classList.contains('grid-cell')) {
                    updateSelection(parseInt(target.dataset.row), parseInt(target.dataset.col));
                }
            }, { passive: false });

            container.appendChild(cell);
        }
    }
}

function renderWordList(words) {
    const container = document.getElementById('wordList');
    container.innerHTML = '';
    words.forEach(word => {
        const chip = document.createElement('div');
        chip.classList.add('word-chip');
        chip.id = `chip-${word}`;
        chip.innerText = word;
        container.appendChild(chip);
    });
    document.getElementById('scoreDisplay').innerText = `Words found: 0 / ${words.length}`;
}

function startSelection(r, c) {
    isInteracting = true;
    startCell = { r, c };
    selectedCells = [`${r}-${c}`];
    updateCellStyles();
}

function updateSelection(r, c) {
    if (!isInteracting || !startCell) return;

    let dr = r - startCell.r;
    let dc = c - startCell.c;
    
    let steps = Math.max(Math.abs(dr), Math.abs(dc));
    if (steps === 0) {
        selectedCells = [`${startCell.r}-${startCell.c}`];
        updateCellStyles();
        return;
    }

    let stepR = dr === 0 ? 0 : dr / steps;
    let stepC = dc === 0 ? 0 : dc / steps;

    if (Math.abs(stepR) !== Math.abs(stepC) && stepR !== 0 && stepC !== 0) {
        return;
    }

    selectedCells = [];
    for (let i = 0; i <= steps; i++) {
        let currR = Math.round(startCell.r + (i * stepR));
        let currC = Math.round(startCell.c + (i * stepC));
        selectedCells.push(`${currR}-${currC}`);
    }

    updateCellStyles();
}

function endSelection() {
    if (!isInteracting) return;
    isInteracting = false;
    startCell = null;

    let formedWord = selectedCells.map(key => {
        const [r, c] = key.split('-').map(Number);
        return grid[r][c];
    }).join('');

    const currentWords = LEVELS[currentLevelIndex].words;
    let matched = placedWords.find(pw => pw.word === formedWord || pw.word === formedWord.split('').reverse().join(''));

    if (matched && currentWords.includes(matched.word) && !foundWords.has(matched.word)) {
        foundWords.add(matched.word);
        
        selectedCells.forEach(key => {
            const cell = document.querySelector(`[data-row='${key.split('-')[0]}'][data-col='${key.split('-')[1]}']`);
            if (cell) cell.classList.add('found');
        });

        const chip = document.getElementById(`chip-${matched.word}`);
        if (chip) chip.classList.add('found');

        document.getElementById('scoreDisplay').innerText = `Words found: ${foundWords.size} / ${currentWords.length}`;

        if (foundWords.size === currentWords.length) {
            setTimeout(showLevelModal, 400);
        }
    }

    selectedCells = [];
    updateCellStyles();
}

function updateCellStyles() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        const key = `${cell.dataset.row}-${cell.dataset.col}`;
        if (selectedCells.includes(key)) {
            cell.classList.add('selected');
        } else {
            cell.classList.remove('selected');
        }
    });
}

function showLevelModal() {
    const modal = document.getElementById('levelModal');
    
    if (currentLevelIndex === LEVELS.length - 1) {
        document.getElementById('modalTitle').innerText = "All Levels Completed! 🏆";
        document.getElementById('modalDesc').innerText = "Congratulations, you've explored all 20 Jetour levels!";
        document.getElementById('nextLevelBtn').innerText = "Play Again from Start";
    } else {
        document.getElementById('modalTitle').innerText = "Journey Completed! 🏁";
        document.getElementById('modalDesc').innerText = "Ready for the next destination?";
        document.getElementById('nextLevelBtn').innerText = "Next Level";
    }
    modal.classList.remove('hidden');
}