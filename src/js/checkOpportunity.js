export default function checkOpportunity(type, position, character, index) {
  const boardSize = 8;
  const board = [];
  let string = [];

  for (let i = 0; i < boardSize ** 2; i += 1) {
    string.push(i);
    if (string.length === boardSize) {
      board.push(string);
      string = [];
    }
  }

  const stringCoords = Math.floor(position / boardSize);
  const columnCoords = position % boardSize;
  const openCells = [];

  if (type === 'move') {
    for (let i = 1; i <= character.walkAbility; i += 1) {
      let openString = stringCoords + i;

      if (openString < boardSize) {
        openCells.push(board[openString][columnCoords]);
      }
      let openColumn = columnCoords + i;

      if (openColumn < boardSize) {
        openCells.push(board[stringCoords][openColumn]);
      }
      if (openString < boardSize && openColumn < boardSize) {
        openCells.push(board[openString][openColumn]);
      }
      openString = stringCoords - i;
      if (openString >= 0) {
        openCells.push(board[openString][columnCoords]);
      }
      if (openString >= 0 && openColumn < boardSize) {
        openCells.push(board[openString][openColumn]);
      }
      openColumn = columnCoords - i;
      if (openColumn >= 0) {
        openCells.push(board[stringCoords][openColumn]);
      }
      if (openString >= 0 && openColumn >= 0) {
        openCells.push(board[openString][openColumn]);
      }
      openString = stringCoords + i;
      if (openString < boardSize && openColumn >= 0) {
        openCells.push(board[openString][openColumn]);
      }
    }
  } else {
    let minString = stringCoords - character.attackAbility;

    if (minString < 0) {
      minString = 0;
    }
    let maxString = stringCoords + character.attackAbility;

    if (maxString >= boardSize) {
      maxString = boardSize - 1;
    }
    let minColumn = columnCoords - character.attackAbility;

    if (minColumn < 0) {
      minColumn = 0;
    }
    let maxColumn = columnCoords + character.attackAbility;

    if (maxColumn >= boardSize) {
      maxColumn = boardSize - 1;
    }

    for (let s = minString; s <= maxString; s += 1) {
      for (let c = minColumn; c <= maxColumn; c += 1) {
        openCells.push(board[s][c]);
      }
    }
  }
  return openCells.includes(index);
}
