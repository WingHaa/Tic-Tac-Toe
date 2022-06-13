const pubsub = (() => {
	let events = {};
	const subscribe = (eveName, func) => {
		events[eveName] = events[eveName] || [];
		events[eveName].push(func);
	};
	const publish = (eveName, data) => {
		events[eveName].forEach(func => func(data));
	};
	return {subscribe, publish};
})();

const gameBoard = (() => {
	let board = [];
	for (let i = 0; i < 3; i++) {
		board = new Array(3);
	}
	for (let i = 0; i < board.length; i++) {
		board[i] = new Array(3);
	}
	
	const render = (container => {
		for (let i = 0; i < board.length; i++) {
			const boardRows = board[i];
			for (let n = 0; n < boardRows.length; n++) {
				let div = document.createElement('div');
				div.dataset.id = i.toString() + n.toString();
				div.className = 'board-area';
				container.appendChild(div);
				const boardArea = document.querySelectorAll('.board-area');
				boardArea.forEach(area => 
          area.addEventListener('pointerdown', renderMove));
			}
		}
	});
	
	const renderMove = ((event) => {

	});
	
	return {render};
})();

const board = document.querySelector('.game-board');
gameBoard.render(board)