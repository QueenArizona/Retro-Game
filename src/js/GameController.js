import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import Daemon from './characters/Daemon';
import GamePlay from './GamePlay';
import { generateTeam } from './generators';
import info from './info';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.userTeam = generateTeam([Bowman, Swordsman], 1, 2);
    this.computerTeam = generateTeam([Undead, Daemon, Vampire], 1, 2);
    this.players = [...this.userTeam, ...this.computerTeam];
    this.selectedCell = null;
    this.selectedChar = null;
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.gamePlay.redrawPositions(this.players);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onCellClick(index) {
    const characterOnCell = this.players.find((el) => el.position === index);

    if (characterOnCell) {
      if (['bowman', 'swordsman', 'magician'].includes(characterOnCell.character.type)) {
        this.gamePlay.selectCell(index);
        if (this.selectedCell != null) {
          this.gamePlay.deselectCell(this.selectedCell);
        }
        this.selectedCell = index;
        this.selectedChar = characterOnCell;
      } else {
        GamePlay.showError('You cannot play this character');
      }
    }
  }

  onCellEnter(index) {
    const characterOnCell = this.players.find((el) => el.position === index);

    if (characterOnCell) {
      this.gamePlay.showCellTooltip(info(characterOnCell), index);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }
}
