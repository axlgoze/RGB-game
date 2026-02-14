const colorsDiv = document.getElementById("color");
const easyBtn = document.getElementById("easy-btn");
const hardBtn = document.getElementById("hard-btn");
const rgbTitle = document.getElementById("rgb-title");
const resetColorsBtn = document.getElementById("reset-colors-btn");
const title = document.getElementById("title");
const colorToGuess = document.getElementById("color-to-guess");
const gameTitle = document.getElementById("game-title");
const controls = document.getElementById("controls");

let items = [];
let winerColor = null;
resetColorsBtn.style.pointerEvents = "none";

// @property {number} difficulty - difficulty selected hard == 0.
let difficulty = null;
let notWiner = null;

easyBtn.addEventListener("click",setEasyDifficult);
hardBtn.addEventListener("click",setHardDifficult);
resetColorsBtn.addEventListener("click", newColors);


colorsDiv.addEventListener("click",function(e){
   if (e.target.classList.contains("circle")) {
        const colorClicked = e.target.dataset.colorCode;
        checkMatch(colorClicked);
    }
    if(!notWiner){
      e.target.classList.add("shake");
      e.target.classList.add("hidden");
      setTimeout(() => {
        e.target.style.opacity = "0";
    }, 300);
    }
})


function checkMatch(colorClicked){
   if (colorClicked == winerColor) {
      console.log("YOU ROCK!")
      handleWin();
      
   }else{
      return notWiner = false;
   }
}

function handleWin() {
   colorsDiv.innerHTML = ""
   document.body.style.backgroundColor = winerColor;
   colorToGuess.textContent = "¡CORRECT!";
   colorToGuess.style.color = "white";
   gameTitle.style.backgroundColor = winerColor;
   const intervaloId = setInterval(() => {
      let randomColor = items[Math.floor(Math.random() * items.length)];
      rgbTitle.style.color = randomColor;
      controls.style.color = randomColor;

    }, 100);
   setTimeout(() => {
      clearInterval(intervaloId);
      resetGame();
   }, 3000);
}

function resetGame(){
   items.length = 0;
   colorsDiv.innerHTML = ""
   colorToGuess.style.display = "none";
   difficulty = null;
   easyBtn.classList.remove('controls__btn--selected');
   hardBtn.classList.remove('controls__btn--selected');
   resetColorsBtn.style.pointerEvents = "none";
   notWiner = null;
   document.body.style.backgroundColor = '#232323';
   rgbTitle.style.color = '#fff';
   controls.style.backgroundColor = '#fff';
}


function newColors(){
   createContainers(difficulty);
   generateColors(difficulty);
   fillColorContainers();
}


function setHardDifficult(){
   resetColorsBtn.style.pointerEvents = "auto";
   colorToGuess.style.display = "block";
   difficulty = 0;
   hardBtn.classList.add('controls__btn--selected');
   easyBtn.classList.remove('controls__btn--selected');
   createContainers(difficulty);
   generateColors(difficulty);
   fillColorContainers();
}

function setEasyDifficult(){
   resetColorsBtn.style.pointerEvents = "auto";
   colorToGuess.style.display = "block";
   difficulty = 1;
   easyBtn.classList.add('controls__btn--selected');
   hardBtn.classList.remove('controls__btn--selected');
   createContainers(difficulty);
   generateColors(difficulty);
   fillColorContainers();
}

function fillColorContainers(){
   winerColor = items[Math.floor(Math.random() * items.length)];
   colorToGuess.textContent = `Which circle correspond to ${winerColor}`;
   let containers = document.querySelectorAll(".circle");
   
   containers.forEach((div,i) => {
         div.style.backgroundColor = items[i];
         div.dataset.colorCode = items[i]
   });
}

function generateColors(difficulty){
   let numColors = difficulty === 0 ? 6 : 3;
   items.length = 0;
   
   for (let i = 0; i < numColors; i++) {
      let r=Math.floor(Math.random()*256);
      let g=Math.floor(Math.random()*256);
      let b=Math.floor(Math.random()*256);
      
      let colorCode = `rgb(${r} ${g} ${b})`;

      items.push(colorCode);
   }
}

/**
 * create a color container in DOM.
 * @param {Evento} newEvent - El objeto del evento a guardar.
 */
function createContainers(difficulty) {
   colorsDiv.innerHTML = ""
   let numContainers = difficulty === 0 ? 6 : 3;
   let circles = "";
      for (let index = 0; index < numContainers; index++) {
         circles += `
            <div class="color__container circle" data-color-code=""></div>
         `;
      }
      colorsDiv.innerHTML = circles;
}