const boardEl = document.getElementById('board');
const statusBar = document.getElementById('statusBar');
const modePvp = document.getElementById('modePvp');
const modeAi = document.getElementById('modeAi');
const diffRow = document.getElementById('diffRow');
const diffEasy = document.getElementById('diffEasy');
const diffHard = document.getElementById('diffHard');
const newRoundBtn = document.getElementById('newRoundBtn');
const clearScoreBtn = document.getElementById('clearScoreBtn');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreOLabel = document.getElementById('scoreOLabel');
const scoreDraw = document.getElementById('scoreDraw');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');

const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let vsAi = false;
let aiDifficulty = 'hard'; // 'easy' | 'hard'
let scores = { X: 0, O: 0, draw: 0 };

function buildBoard(){
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++){
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.idx = i;
        cell.addEventListener('click', () => handleCellClick(i));
        boardEl.appendChild(cell);
    }
}

function checkWinner(b){
    for (const line of WIN_LINES){
        const [a, c, d] = line;
        if (b[a] && b[a] === b[c] && b[a] === b[d]){
        return { winner: b[a], line };
        }
    }
    if (b.every(cell => cell !== null)) return { winner: 'draw', line: null };
    return null;
}

function renderBoard(){
    const cells = boardEl.children;
    for (let i = 0; i < 9; i++){
        const cell = cells[i];
        cell.classList.remove('win-cell');
        if (board[i]){
        cell.classList.add('filled', board[i].toLowerCase());
        cell.innerHTML = `<span>${board[i]}</span>`;
        } else {
        cell.classList.remove('filled', 'x', 'o');
        cell.innerHTML = '';
        }
        cell.classList.toggle('locked', gameOver || (vsAi && currentPlayer === 'O'));
    }
}

function setStatus(){
    if (gameOver){
        const result = checkWinner(board);
        if (result.winner === 'draw'){
        statusBar.innerHTML = `<span class="draw-text">It's a draw</span>`;
        } else {
        const label = (vsAi && result.winner === 'O') ? 'Computer' : `Player ${result.winner}`;
        statusBar.innerHTML = `<span class="win-text">${label} wins! 🎉</span>`;
        }
    } else {
        const label = vsAi && currentPlayer === 'O' ? 'Computer' : currentPlayer;
        statusBar.innerHTML = `Turn: <span class="turn-${currentPlayer.toLowerCase()}">${label}</span>`;
    }
}

function handleCellClick(i){
    if (gameOver || board[i]) return;
    if (vsAi && currentPlayer === 'O') return;

    makeMove(i, currentPlayer);

    const result = checkWinner(board);
    if (result){
        finishGame(result);
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    renderBoard();
    setStatus();

    if (vsAi && currentPlayer === 'O' && !gameOver){
        setTimeout(aiMove, 380);
    }
}

function makeMove(i, player){
    board[i] = player;
}

function finishGame(result){
    gameOver = true;
    if (result.winner === 'draw'){
        scores.draw++;
    } else {
        scores[result.winner]++;
        result.line.forEach(idx => boardEl.children[idx].classList.add('win-cell'));
    }
    renderBoard();
    setStatus();
    updateScoreDisplay();
    saveScores();
}

function aiMove(){
    if (gameOver) return;
    let move;
    if (aiDifficulty === 'easy' && Math.random() < 0.5){
        const empty = board.map((v,i) => v === null ? i : null).filter(v => v !== null);
        move = empty[Math.floor(Math.random() * empty.length)];
    } else {
        move = bestMove();
    }
    makeMove(move, 'O');
    const result = checkWinner(board);
    if (result){
        finishGame(result);
        return;
    }
    currentPlayer = 'X';
    renderBoard();
    setStatus();
}
function bestMove(){
    let best = { score: -Infinity, idx: -1 };
    for (let i = 0; i < 9; i++){
        if (board[i] === null){
            board[i] = 'O';
            const score = minimax(board, 0, false, -Infinity, Infinity);
            board[i] = null;
        if (score > best.score){ best = { score, idx: i }; }
        }
    }
    return best.idx;
}

function minimax(b, depth, isMaximizing, alpha, beta){
    const result = checkWinner(b);
    if (result){
        if (result.winner === 'O') return 10 - depth;
        if (result.winner === 'X') return depth - 10;
        return 0;
    }
    if (isMaximizing){
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++){
        if (b[i] === null){
            b[i] = 'O';
            const evalScore = minimax(b, depth + 1, false, alpha, beta);
            b[i] = null;
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
    }
    return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 9; i++){
        if (b[i] === null){
            b[i] = 'X';
            const evalScore = minimax(b, depth + 1, true, alpha, beta);
            b[i] = null;
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
    }
    return minEval;
    }
}

function newRound(){
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameOver = false;
    renderBoard();
    setStatus();
}

function updateScoreDisplay(){
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreDraw.textContent = scores.draw;
    scoreOLabel.textContent = vsAi ? 'Computer' : 'Player O';
}

function setMode(ai){
    vsAi = ai;
    modePvp.classList.toggle('active', !ai);
    modeAi.classList.toggle('active', ai);
    diffRow.classList.toggle('hidden', !ai);
    updateScoreDisplay();
    newRound();
    saveScores();
}

function setDifficulty(diff){
    aiDifficulty = diff;
    diffEasy.classList.toggle('active', diff === 'easy');
    diffHard.classList.toggle('active', diff === 'hard');
    saveScores();
}

function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 1600);
}

  // ---------- persistence ----------
async function saveScores(){
    try{
        await window.storage.set('tictactoe:state', JSON.stringify({
        scores, vsAi, aiDifficulty,
        theme: document.documentElement.getAttribute('data-theme') || 'light'
    }));
    } catch(e){ /* storage unavailable */ }
}
async function loadScores(){
    let theme = 'light';
    try{
        const res = await window.storage.get('tictactoe:state');
        if (res && res.value){
        const s = JSON.parse(res.value);
        scores = s.scores || scores;
        vsAi = !!s.vsAi;
        aiDifficulty = s.aiDifficulty || 'hard';
        theme = s.theme || 'light';
    }
    } catch(e){ /* first run */ }
    applyTheme(theme);
    modePvp.classList.toggle('active', !vsAi);
    modeAi.classList.toggle('active', vsAi);
    diffRow.classList.toggle('hidden', !vsAi);
    diffEasy.classList.toggle('active', aiDifficulty === 'easy');
    diffHard.classList.toggle('active', aiDifficulty === 'hard');
    updateScoreDisplay();
}

modePvp.addEventListener('click', () => setMode(false));
modeAi.addEventListener('click', () => setMode(true));
diffEasy.addEventListener('click', () => setDifficulty('easy'));
diffHard.addEventListener('click', () => setDifficulty('hard'));
newRoundBtn.addEventListener('click', newRound);
clearScoreBtn.addEventListener('click', () => {
    scores = { X: 0, O: 0, draw: 0 };
    updateScoreDisplay();
    saveScores();
    showToast('Scores reset');
});
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
    saveScores();
});

buildBoard();
loadScores().then(() => { renderBoard(); setStatus(); });