import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import Daemon from './characters/Daemon';
import { generateTeam } from './generators';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.userTeam = generateTeam([Bowman, Swordsman], 1, 2);
    this.computerTeam = generateTeam([Undead, Daemon, Vampire], 1, 2);
    this.players = [...this.userTeam, ...this.computerTeam];
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.gamePlay.redrawPositions(this.players);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
