let sequence = [];
let playerSequence = [];
let score = 0;
let allowInput = false;
let currentPlayer = null;

// Seleciona os elementos do DOM
const startButton = document.getElementById('start-game');
const scoreDisplay = document.getElementById('score');
const characterBoxes = document.querySelectorAll('.character-box'); // Substituí color-box por character-box
const registerBtn = document.getElementById('register-btn');
const usernameInput = document.getElementById('username');
const gameSection = document.getElementById('game-section');
const rankingList = document.getElementById('ranking-list');

// Função para carregar ranking do localStorage
function loadRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    rankingList.innerHTML = '';
    ranking.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.username} - ${player.score} pontos`;
        rankingList.appendChild(li);
    });
}

// Função para salvar pontuação no ranking
function saveScore(username, score) {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const playerIndex = ranking.findIndex(player => player.username === username);

    if (playerIndex >= 0) {
        if (score > ranking[playerIndex].score) {
            ranking[playerIndex].score = score;
        }
    } else {
        ranking.push({ username, score });
    }

    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem('ranking', JSON.stringify(ranking));
    loadRanking();
}

// Função de cadastro do jogador
registerBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentPlayer = username;
        usernameInput.value = '';
        gameSection.style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
    } else {
        alert('Digite um nome de usuário!');
    }
});

// Função para iniciar o jogo
startButton.addEventListener('click', startGame);

function startGame() {
    sequence = [];
    playerSequence = [];
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    nextRound();
}

// Adiciona um personagem aleatório à sequência e exibe para o jogador
function nextRound() {
    const characters = ['alvin', 'simon', 'theodor', 'ivan']; // IDs das imagens
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    sequence.push(randomCharacter);
    allowInput = false;
    playerSequence = [];
    displaySequence();
}

// Exibe a sequência de personagens
function displaySequence() {
    sequence.forEach((character, index) => {
        setTimeout(() => {
            playCharacter(character);
        }, (index + 1) * 800);
    });

    setTimeout(() => {
        allowInput = true;  // Permite o input do jogador após a sequência
    }, sequence.length * 800);
}

// Função para animar o personagem correspondente
function playCharacter(character) {
    const element = document.getElementById(character);
    element.classList.add('active');
    setTimeout(() => {
        element.classList.remove('active');
    }, 400);
}

// Adiciona eventos de clique às imagens
characterBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
        if (!allowInput) return;  // Bloqueia input durante a exibição da sequência

        const character = e.target.id;
        playerSequence.push(character);
        playCharacter(character);
        checkSequence();
    });
});

// Verifica se a sequência clicada pelo jogador está correta
function checkSequence() {
    const lastIndex = playerSequence.length - 1;
    if (playerSequence[lastIndex] !== sequence[lastIndex]) {
        alert('Erro! Fim do jogo.');
        saveScore(currentPlayer, score);  // Salva a pontuação no ranking
        gameSection.style.display = 'none'; // Oculta o jogo para reiniciar
        document.getElementById('register-form').style.display = 'block';
        return;
    }

    if (playerSequence.length === sequence.length) {
        score++;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        setTimeout(nextRound, 1000);
    }
}

// Carregar o ranking ao iniciar
loadRanking();
