const easyBtn = document.getElementById("easy-btn");
const hardBtn = document.getElementById("hard-btn");
const colorsDiv = document.getElementById("color");
const colorToGuess = document.getElementById("color-to-guess");
const gameTitle = document.getElementById("game-title");
const resetColorsBtn = document.getElementById("reset-colors-btn");
const controls = document.getElementById("controls");
const rgbTitle = document.getElementById("rgb-title");

const gameState = {
    difficulty: null,
    colors: [],
    pickedColor: '',
    isGameOver: false,
    config: {
        EASY: 3,
        HARD: 6
    }
}

const VisualEffects = {
    celebrationEffect : (elements, colorPalette, duration, resetTargets) => {
    const intervaloId = setInterval(() => {
        const randomColor = Utils.pickRandom(colorPalette);
        
        elements.forEach(e=>{
            e.style.color = randomColor;
        })
    }, 300);
    
    setTimeout(() => {
        clearInterval(intervaloId);
        const targetsToReset = resetTargets 
            ? (Array.isArray(resetTargets) ? resetTargets : [resetTargets])
            : elements;
       targetsToReset.forEach(el => {
            if (el) el.style.color = "#fff";
        });
    }, duration);

    },
    animateCircles : (circles) => {
        circles.forEach(singleCircle => {
        singleCircle.classList.add("animar-pulso");
    });
    }
}

const Utils = {
    generateRandomRGB: () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r} ${g} ${b})`
    },

    generatePalette: (count)=>{
        return Array.from({length: count}, () => Utils.generateRandomRGB());
    },

    pickRandom: (arr) => arr[Math.floor(Math.random() * arr.length)]
}

function initGame(level = 'HARD'){
    const selectedLevel = level || 'HARD';
// 1. Actualizamos el Estado
    gameState.difficulty = selectedLevel;
    gameState.isGameOver = false;
    
    const numCircles = gameState.config[selectedLevel];
    gameState.colors = Utils.generatePalette(numCircles);
    gameState.pickedColor = Utils.pickRandom(gameState.colors);

    renderUI(); 
}

easyBtn.addEventListener("click", () => initGame('EASY'));
hardBtn.addEventListener("click", () => initGame('HARD'));
resetColorsBtn.addEventListener("click", () => initGame(gameState.difficulty));

function renderUI() {
    const { colors, pickedColor, difficulty, isGameOver } = gameState;

    // 1. (Single Source of Truth)
    colorsDiv.innerHTML = colors.map(color => `
        <div class="circle"
             style="background-color: ${color}" 
             data-color-code="${color}">
        </div>
    `).join('');

    colorToGuess.textContent = `Find this color: ${ (pickedColor || "").toUpperCase() }`;
    colorToGuess.style.display = "block";

    easyBtn.classList.toggle('controls__btn--selected', difficulty === 'EASY');
    hardBtn.classList.toggle('controls__btn--selected', difficulty === 'HARD');

    document.body.style.backgroundColor = '#232323';
    gameTitle.style.backgroundColor = '#4682b4';
}

colorsDiv.addEventListener("click", (e) => {
    const clickedCircle = e.target.closest('.circle');
    if (!clickedCircle || gameState.isGameOver) return;

    const selectedColor = clickedCircle.dataset.colorCode;

    if (selectedColor === gameState.pickedColor) {
        handleWin();
    } else {
        clickedCircle.classList.add("shake");
        clickedCircle.classList.add("hidden");
    }
});

function handleWin() {
    gameState.isGameOver = true;
    const { pickedColor, colors } = gameState;

    document.body.style.backgroundColor = pickedColor;
    gameTitle.style.backgroundColor = pickedColor;
    colorToGuess.textContent = "¡CORRECT! YOU ROCK!";
    
    document.querySelectorAll('.circle').forEach(circle => {
        circle.style.opacity = "1";
        circle.style.backgroundColor = pickedColor;
    });

    VisualEffects.celebrationEffect([rgbTitle, controls, gameTitle, colorToGuess], colors, 3000, colorToGuess);
    VisualEffects.animateCircles(document.querySelectorAll('.circle'))
    setTimeout(() => {
        initGame(gameState.difficulty = null);
    }, 3000);
}

initGame('HARD');