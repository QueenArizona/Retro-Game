export function calcTileType(index, boardSize) {
  switch (true) {
    case index === 0:
      return 'top-left';
    case index === boardSize - 1:
      return 'top-right';
    case index > 0 && index < boardSize - 1:
      return 'top';
    case index === boardSize * (boardSize - 1):
      return 'bottom-left';
    case index === (boardSize * boardSize) - 1:
      return 'bottom-right';
    case index > boardSize * (boardSize - 1) && index < (boardSize * boardSize) - 1:
      return 'bottom';
    case (index - (boardSize - 1)) % boardSize === 0:
      return 'right';
    case index > 0 && index % boardSize === 0 && index < boardSize * (boardSize - 1):
      return 'left';
    default:
      return 'center';
  }
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
