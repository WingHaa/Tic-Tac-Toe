const GameModule = (() => {
	const interface = document.querySelector(".interface");
	const modal = document.querySelector(".modal");
	const form = document.querySelector("#application");
	const rematchButton = document.querySelector(".rematch");
	const newGameButton = document.querySelector(".new");
	const playButton = document.querySelector(".start");
	let score = {};
	let turnCounter = 1;
	let player1, player2;

	const increaseTurn = () => {
		turnCounter++;
	};

	const playGame = (e) => {
		e.preventDefault();
		player1 = Player(form.elements.name1.value || "Player 1", "X");
		player2 = Player(form.elements.name2.value || "Player 2", "O");
		interface.style.display = "grid";
		form.style.display = "none";
		displayController.displayScore();
		gameBoard.makeBoard();
		gameBoard.render();
		displayController.listenForMove();
	};

	const rematch = () => {
		player1.resetScore();
		player2.resetScore();
		modal.style.display = "none";
		displayController.displayScore();
	};
	const startNewGame = () => {
		player1 = player2 = undefined;
		interface.style.display = "none";
		modal.style.display = "none";
		form.style.display = "";
		form.elements.name1.value = form.elements.name2.value = "";
	};
	playButton.addEventListener("pointerdown", playGame);
	rematchButton.addEventListener("pointerdown", rematch);
	newGameButton.addEventListener("pointerdown", startNewGame);

	const gameBoard = (() => {
		let board = [];
		const makeBoard = () => {
			for (let i = 0; i < 3; i++) {
				board = new Array(3);
			}
			for (let i = 0; i < board.length; i++) {
				board[i] = new Array(3);
			}
		};

		const render = () => {
			const boardContainer = document.querySelector(".game-board");
			boardContainer.textContent = "";
			for (let i = 0; i < board.length; i++) {
				const boardRows = board[i];
				for (let n = 0; n < boardRows.length; n++) {
					let div = document.createElement("div");
					div.dataset.id = i.toString() + n.toString();
					div.className = "board-area bg-white";
					boardContainer.appendChild(div);
				}
			}
		};

		const getCurrentPlayer = () => {
			if (turnCounter % 2 === 0) return player2;
			return player1;
		};

		const takeTurn = (e) => {
			const player = gameBoard.getCurrentPlayer();
			gameBoard.setMark(e, player.mark);
			displayController.displayMark(e.target, player.mark);
			if (gameBoard.checkRoundWin(player.mark)) {
				gameBoard.getCurrentPlayer().increaseScore();
				displayController.displayScore();
				gameBoard.checkGameEnd();
				return newRound();
			}
			if (gameBoard.checkRoundDraw()) {
				player1.increaseScore();
				player2.increaseScore();
				displayController.displayScore();
				gameBoard.checkGameEnd();
				return newRound();
			}
			return increaseTurn();
		};

		const checkRoundWin = (mark) => {
			if (
				(board[1][1] === mark &&
					((board[1][0] === board[1][1] && board[1][0] === board[1][2]) ||
						(board[0][1] === board[1][1] && board[0][1] === board[2][1]) ||
						(board[0][0] === board[1][1] && board[0][0] === board[2][2]) ||
						(board[2][0] === board[1][1] && board[2][0] === board[0][2]))) ||
				(board[0][1] === mark &&
					board[0][0] === board[0][1] &&
					board[0][0] === board[0][2]) ||
				(board[2][1] === mark &&
					board[2][0] === board[2][1] &&
					board[2][0] === board[2][2]) ||
				(board[1][0] === mark &&
					board[0][0] === board[1][0] &&
					board[0][0] === board[2][0]) ||
				(board[1][2] === mark &&
					board[0][2] === board[1][2] &&
					board[0][2] === board[2][2])
			) {
				return true;
			}

			return false;
		};

		const checkRoundDraw = () => {
			for (let row of board) if (row.includes(undefined)) return false;
			return true;
		};

		const newRound = () => {
			turnCounter = 1;
			makeBoard();
			render();
			displayController.listenForMove();
		};

		const setMark = (e, mark) => {
			const id = e.target.dataset.id;
			if (board[id[0]][id[1]] === undefined) return (board[id[0]][id[1]] = mark);
		};

		const checkGameEnd = () => {
			if (
				player1.getPlayerScore() === player2.getPlayerScore() &&
				player1.getPlayerScore() === 1
			) {
				return "draw";
			}
			if (player1.getPlayerScore() === 1) {
				modal.style.display = "block";
				return displayController.displayResult("Player 1 win");
			}
			if (player2.getPlayerScore() === 1) {
				modal.style.display = "block";
				return displayController.displayResult("Player 2 win");
			} else return;
		};

		return {
			increaseTurn,
			getCurrentPlayer,
			newRound,
			makeBoard,
			takeTurn,
			setMark,
			render,
			checkRoundWin,
			checkRoundDraw,
			checkGameEnd
		};
	})();

	const displayController = (() => {
		const listenForMove = () => {
			const boardAreas = document.querySelectorAll(".board-area");
			boardAreas.forEach((area) =>
				area.addEventListener("pointerdown", gameBoard.takeTurn)
			);
		};

		const displayMark = (cell, mark) => {
			cell.removeEventListener("pointerdown", gameBoard.takeTurn);
			cell.textContent = mark;
		};

		const displayScore = () => {
			const playerOneScore = document.querySelector(".a-score");
			const playerTwoScore = document.querySelector(".b-score");
			playerOneScore.textContent = player1.name + ": " + player1.getPlayerScore();
			playerTwoScore.textContent = player2.name + ": " + player2.getPlayerScore();
		};

		const displayResult = (message) => {
			const result = document.querySelector(".result");
			result.textContent = message;
		};

		return { listenForMove, displayMark, displayScore, displayResult };
	})();

	return { gameBoard, displayController };
})();

const Player = (name, mark) => {
	let score = 0;

	const getPlayerScore = () => {
		return score;
	};

	const increaseScore = () => {
		score += 1;
	};

	const resetScore = () => {
		score = 0;
	};

	return { name, mark, getPlayerScore, increaseScore, resetScore };
};