/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import Daemon from './characters/Daemon';
import GamePlay from './GamePlay';
import GameState from './GameState';
import { generateTeam } from './generators';
import info from './info';
import checkOpportunity from './checkOpportunity';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.userTeam = generateTeam([Bowman, Swordsman], 1, 2);
    this.computerTeam = generateTeam([Undead, Daemon, Vampire], 1, 2);
    this.players = [...this.userTeam, ...this.computerTeam];
    this.gameState = new GameState();
    this.selectedCell = null;
    this.selectedMouseCell = null;
    this.selectedChar = null;
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.gamePlay.redrawPositions(this.players);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  async attack(attacker, target, index) {
    const damage = Math.ceil(Math.max(attacker.attack - target.character.defence, attacker.attack * 0.1));

    await this.gamePlay.showDamage(index, damage);
    target.character.health -= damage;
    if (target.character.health <= 0) {
      if (['bowman', 'swordsman', 'magician'].includes(target.character.type)) {
        const deleted = this.userTeam.indexOf(target);

        this.userTeam.splice(deleted, 1);
      } else {
        const deleted = this.computerTeam.indexOf(target);

        this.computerTeam.splice(deleted, 1);
      }
      this.players = [...this.userTeam, ...this.computerTeam];
    }
    this.gamePlay.redrawPositions(this.players);
    this.selectedChar = null;
  }

  async onCellClick(index) {
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
        if (this.selectedChar === null) return;
        const canAttack = checkOpportunity('attack', this.selectedChar.position, this.selectedChar.character, index);

        if (canAttack) {
          const attacker = this.selectedChar.character;
          const target = this.players.find((el) => el.position === index);

          await this.attack(attacker, target, index);
          this.selectedChar = null;
          this.gameState.turn = 'computer';
        } else {
          GamePlay.showError('You cannot play this character');
        }
      }
    } else if (this.selectedChar !== null) {
      const canMove = checkOpportunity('move', this.selectedChar.position, this.selectedChar.character, index);

      if (canMove) {
        this.selectedChar.position = index;
        this.gamePlay.redrawPositions(this.players);
        if (this.selectedCell != null) {
          this.gamePlay.deselectCell(this.selectedCell);
        }
        this.selectedChar = null;
        this.gameState.turn = 'computer';
      }
    }
    this.selectedCell = null;
  }

  onCellEnter(index) {
    const changeSelectCell = () => {
      if (this.selectedMouseCell != null) {
        this.gamePlay.deselectCell(this.selectedMouseCell);
      }
      this.selectedMouseCell = index;
    };
    const characterOnCell = this.players.find((el) => el.position === index);

    if (characterOnCell) {
      this.gamePlay.showCellTooltip(info(characterOnCell), index);
      if (['undead', 'vampire', 'daemon'].includes(characterOnCell.character.type)) {
        if (this.selectedChar !== null) {
          const canAttack = checkOpportunity('attack', this.selectedChar.position, this.selectedChar.character, index);

          if (canAttack) {
            this.gamePlay.setCursor('crosshair');
            this.gamePlay.selectCell(index, 'red');
            changeSelectCell();
          } else {
            this.gamePlay.setCursor('not-allowed');
            changeSelectCell();
          }
        }
      } else {
        this.gamePlay.setCursor('pointer');
        changeSelectCell();
      }
    } else if (this.selectedChar !== null) {
      const canMove = checkOpportunity('move', this.selectedChar.position, this.selectedChar.character, index);

      if (canMove) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
        changeSelectCell();
      } else {
        this.gamePlay.setCursor('not-allowed');
        changeSelectCell();
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }
}
