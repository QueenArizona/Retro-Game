/* eslint-disable max-len */
export default function getPosition(character) {
  const userPositions = [];
  const computerPositions = [];
  const boardsize = 8;

  for (let position = 0; position < boardsize * boardsize; position += 1) {
    if (position === 0 || position % boardsize === 0 || (position - 1) === 0 || (position - 1) % boardsize === 0) {
      userPositions.push(position);
    } else if (position - (boardsize - 1) === 0 || (position - (boardsize - 1)) % boardsize === 0 || position - (boardsize - 2) === 0 || (position - (boardsize - 2)) % boardsize === 0) {
      computerPositions.push(position);
    }
  }

  if (['bowman', 'swordsman', 'magician'].includes(character.type)) {
    return userPositions[Math.floor(Math.random() * (userPositions.length - 1))];
  }
  if (['undead', 'daemon', 'vampire'].includes(character.type)) {
    return computerPositions[Math.floor(Math.random() * (computerPositions.length - 1))];
  }
  return false;
}
