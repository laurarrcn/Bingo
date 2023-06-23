//bingo desenvolvido com o auxílio do chatGPT, google, e youtube e adaptado por mim.


let players = [];
let drawnNumbers = [];
let winner = null;
let drawInterval;


function addParticipant() {
  const playerName = document.getElementById("participantName").value;
  if (playerName.trim() === "") {
    alert("Por favor, insira um nome para o jogador.");
    return;
  }

  if (players.length >= 20) {
    alert("O limite máximo de jogadores foi atingido.");
    return;
  }

  players.push({
    name: playerName,
    numbers: generateUniqueNumbers(),
    complete: false,
  });

  updatePlayerTables();
  document.getElementById("participantName").value = "";
}


function generateUniqueNumbers() {
  const numbers = [];
  while (numbers.length < 25) {
    const randomNumber = Math.floor(Math.random() * 75) + 1;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers;
}


function updatePlayerTables() {
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = "";

  players.forEach((player, index) => {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("bingo-card");

    const boardTitle = document.createElement("h3");
    boardTitle.textContent = player.name;
    boardDiv.appendChild(boardTitle);

    const boardTable = document.createElement("table");
    player.numbers.forEach((number, i) => {
      if (i % 5 === 0) {
        const row = document.createElement("tr");
        boardTable.appendChild(row);
      }
      const row = boardTable.lastElementChild;
      const cell = document.createElement("td");

    //@laurarrcn
      if (i === 12) {
        cell.textContent = "X";
        cell.classList.add("center-cell");
      } else {
        cell.textContent = number;
      }

      row.appendChild(cell);

      
      if (drawnNumbers.includes(number)) {
        cell.classList.add("marked");
      }
    });

    boardDiv.appendChild(boardTable);
    boardContainer.appendChild(boardDiv);
  });
}


function startGame() {
  if (players.length === 0) {
    alert("Por favor, adicione pelo menos um jogador.");
    return;
  }

  document.getElementById("Board").removeChild(document.querySelector("#Board button"));
  document.getElementById("Board").style.marginBottom = "0";

  document.getElementById("drawnNumbers").style.display = "block";

  document.getElementById("participantName").disabled = true;
  document.getElementById("participantName").placeholder = "Jogo em andamento";

  document.getElementById("boardContainer").style.pointerEvents = "none";
  document.getElementById("boardContainer").style.opacity = "0.5";

  document.getElementById("winnerName").textContent = "";

  drawInterval = setInterval(drawNumber, 1000); 
}


function drawNumber() {
  if (winner) {
    alert("O jogo já foi encerrado. Reinicie para jogar novamente.");
    clearInterval(drawInterval);
    return;
  }

  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * 75) + 1;
  } while (drawnNumbers.includes(randomNumber));
//@laurarrcn
  drawnNumbers.push(randomNumber);
  updateDrawnNumbersList();
  updatePlayerTables();

  checkForWinner();
}


function updateDrawnNumbersList() {
  const drawnList = document.getElementById("drawnList");
  const numberDiv = document.createElement("div");
  numberDiv.textContent = drawnNumbers[drawnNumbers.length - 1];
  drawnList.appendChild(numberDiv);

  players.forEach((player) => {
    if (player.complete) return; 

    const boardDivs = document.querySelectorAll(".bingo-card");
    const boardIndex = players.indexOf(player);
    const boardTable = boardDivs[boardIndex].querySelector("table");

    player.numbers.forEach((number, i) => {
      const cells = boardTable.getElementsByTagName("td");
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent == number) {
          cells[i].classList.add("marked");
        }
      }
    });

    const remainingNumbers = player.numbers.filter((number) => !drawnNumbers.includes(number));
    if (remainingNumbers.length === 0) {
      player.complete = true;
      boardTable.classList.add("completed");
    }
  });
}


function checkForWinner() {
    const winners = players.filter((player) => player.complete);
    
    if (winners.length === 1) {

      const winnerName = winners[0].name;
      winner = winners[0];
      clearInterval(drawInterval);
      alert(`O ganhador foi ${winnerName}!`);
    } else if (winners.length > 1) {

      clearInterval(drawInterval);
      alert("Houve um empate! ");
    }
  
    if (!winner && drawnNumbers.length === 75) {
      alert("Todos os números foram sorteados. O jogo terminou em empate.");
      clearInterval(drawInterval);
    }
  }

function restartGame() {
  location.reload();
}


updatePlayerTables();
