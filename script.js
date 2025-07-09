const bgMusic = document.getElementById('bgMusic');
function playMusic() {
  bgMusic.play().catch(e => {
    console.log("Music play prevented, user interaction required.");
  });
}
function pauseMusic() {
  bgMusic.pause();
}
const boxes = document.querySelectorAll('.opt');
const main = document.querySelector('#main');
const stakeInput = document.querySelector('#stake');
const stakeBtn = document.querySelector('#s-stake');
const cashOutBtn = document.querySelector('#cashOut');
const startBtn = document.querySelector('#start');
const moneyDisplay = document.querySelector('#moneyDisplay');
const scoreText = document.querySelector('#score');
const currentMultiplierText = document.querySelector('#currentMultiplier');
const nextMultiplierText = document.querySelector('#nextMultiplier');
const totalMoneyText = document.querySelector('#totalMoney');
const remainingBoxesText = document.querySelector('#remainingBoxes');
const bombSelect = document.getElementById('bombCount'); // The <select> for bombs

const totalBoxes = 25;
let money = 1000.00;
let stakeAmount = 0;
let openedBoxes = 0;
let multiplierIndex = 0;
let bombPositions = [];
let multipliers = [];

// Multiplier config: grows faster with more bombs
function generateMultipliers(bombs, totalSteps = 25) {
  const base = 1.05;
  const growthRate = 0.1 + (bombs * 0.05);
  return Array.from({ length: totalSteps }, (_, i) =>
    parseFloat(((base + growthRate) ** i).toFixed(2))
  );
}

function resetGame() {
  openedBoxes = 0;
  multiplierIndex = 0;
  stakeAmount = 0;
  bombPositions = [];
  boxes.forEach(b => {
    b.style.backgroundImage = "url('img/mines69.webp')";
    b.style.pointerEvents = 'none';
  });
  scoreText.textContent = "";
  remainingBoxesText.textContent = "";
  currentMultiplierText.textContent = "";
  nextMultiplierText.textContent = "";
  totalMoneyText.textContent = `Total Money: $${money.toFixed(2)}`;
  moneyDisplay.value = `$XXXX`;
  main.classList.add('blur');
  cashOutBtn.style.display = 'none';
  stakeBtn.style.display = 'block';
  stakeInput.style.display = 'block';
  stakeInput.value = '';
  startBtn.style.display = 'block';
}

stakeBtn.addEventListener('click', () => {
  startBtn.click();
});

startBtn.addEventListener('click', () => {
  const val = parseFloat(stakeInput.value);
  if (isNaN(val) || val <= 0 || val > money) {
    alert('Invalid stake!');
    return;
  }

  const numberOfBombs = parseInt(bombSelect.value);
  if (isNaN(numberOfBombs) || numberOfBombs < 1 || numberOfBombs >= totalBoxes) {
    alert('Invalid bomb count!');
    return;
  }
  document.getElementById('gameStartSound').play().catch(e => {
  console.log("Game start sound play prevented.");
});

  playMusic();

  // Generate multipliers dynamically based on bomb count
  multipliers = generateMultipliers(numberOfBombs);
  openedBoxes = 0;
  multiplierIndex = 0;
  stakeAmount = val;
  money -= stakeAmount;

  boxes.forEach(b => {
    b.style.backgroundImage = "url('img/mines69.webp')";
    b.style.pointerEvents = 'none';
  });

  scoreText.textContent = "Boxes Opened: 0";
  remainingBoxesText.textContent = `Remaining Boxes: ${totalBoxes}`;
  currentMultiplierText.textContent = "Current Multiplier: -";
  nextMultiplierText.textContent = "Next Multiplier: -";
  totalMoneyText.textContent = `Total Money: $${money.toFixed(2)}`;
  moneyDisplay.value = `$${money.toFixed(2)}`;

  // Place bombs randomly
  bombPositions = [];
  while (bombPositions.length < numberOfBombs) {
    const rand = Math.floor(Math.random() * totalBoxes);
    if (!bombPositions.includes(rand)) {
      bombPositions.push(rand);
    }
  }

  console.log("Bombs at:", bombPositions.map(i => i + 1).join(", "));

  boxes.forEach(b => b.style.pointerEvents = 'auto');
  main.classList.remove('blur');
  stakeBtn.style.display = 'none';
  stakeInput.style.display = 'none';
  startBtn.style.display = 'none';
});

boxes.forEach((box, index) => {
  box.addEventListener('click', () => {
    if (box.style.pointerEvents === 'none') return;

    if (bombPositions.includes(index)) {
      box.style.backgroundImage = "url('img/mines2')";
      document.getElementById('gameOverSound').play();
      main.classList.add('blur');
      cashOutBtn.style.display = 'none';
      boxes.forEach(b => b.style.pointerEvents = 'none');
      setTimeout(() => {
        resetGame();
      }, 3000);
    } else {
      box.style.backgroundImage = "url('img/bomb69.webp')";
      box.style.pointerEvents = 'none';
      openedBoxes++;
      multiplierIndex++;
      scoreText.textContent = `Boxes Opened: ${openedBoxes}`;
      remainingBoxesText.textContent = `Remaining Boxes: ${totalBoxes - openedBoxes}`;

      const current = multipliers[multiplierIndex - 1] || 1;
      const next = multipliers[multiplierIndex] || current;
      currentMultiplierText.textContent = `Current Multiplier: ${current.toFixed(2)}`;
      nextMultiplierText.textContent = `Next Multiplier: ${next.toFixed(2)}`;
      cashOutBtn.style.display = 'inline-block';

      const winnings = stakeAmount * current;
      moneyDisplay.value = `$${winnings.toFixed(2)}`;
      totalMoneyText.textContent = `Total Money: $${money.toFixed(2)}`;

      if (openedBoxes >= totalBoxes - bombPositions.length) {
        alert("🎉 You opened all safe boxes!");
        cashOutBtn.click();
      }
    }
  });
});

cashOutBtn.addEventListener('click', () => {
  const current = multipliers[multiplierIndex - 1] || 1;
  const winnings = stakeAmount * current;
  money += winnings;
  alert(`🎉 You cashed out $${winnings.toFixed(2)}!`);
  resetGame();
});
  playMusic();
resetGame();
  