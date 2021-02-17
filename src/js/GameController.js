/* eslint-disable consistent-return */
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
import getPosition from './getPosition';

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
    this.level = 1;
    this.points = 0;
    this.locked = false;
  }

  static levelUp(character) {
    if (character.health <= 0) return;
    character.level += 1;
    character.attack = Math.ceil(Math.max(character.attack, character.attack * (1.8 - character.health / 100)));
    character.defence = Math.ceil(Math.max(character.defence, character.defence * (1.8 - character.health / 100)));
    character.health += 80;
    if (character.health > 100) {
      character.health = 100;
    }
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.gamePlay.redrawPositions(this.players);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
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
    if (this.computerTeam.length === 0) {
      this.nextLevel();
    }
    if (this.userTeam.length === 0) {
      this.gameOver();
      GamePlay.showMessage('Вы проиграли!');
    }
  }

  async computerGame() {
    if (this.computerTeam.length === 0) return;
    const attackOpportunity = [];

    this.computerTeam.forEach((el) => {
      const opportunityArr = [];

      for (let i = 0; i < this.userTeam.length; i += 1) {
        const opportunity = checkOpportunity('attack', el.position, el.character, this.userTeam[i].position);

        opportunityArr.push(opportunity);
      }
      attackOpportunity.push(opportunityArr);
    });

    function isTrue(el) {
      return el.includes(true);
    }

    const computerCanAttack = attackOpportunity.findIndex(isTrue);

    if (computerCanAttack !== -1) {
      const attacker = this.computerTeam[computerCanAttack].character;
      const targetIndex = attackOpportunity[computerCanAttack].indexOf(true);
      const target = this.userTeam[targetIndex];
      const index = target.position;

      await this.attack(attacker, target, index);
    } else {
      const randomComputerIndex = Math.floor(Math.random() * this.computerTeam.length);
      let moveDone = 'false';

      while (moveDone === 'false') {
        const randomCellIndex = Math.floor(Math.random() * 64);
        const characterOnCell = this.players.find((el) => el.position === randomCellIndex);

        if (!characterOnCell) {
          const canComputerMove = checkOpportunity('move', this.computerTeam[randomComputerIndex].position, this.computerTeam[randomComputerIndex].character, randomCellIndex);

          if (canComputerMove) {
            this.computerTeam[randomComputerIndex].position = randomCellIndex;
            this.gamePlay.redrawPositions(this.players);
            moveDone = 'true';
          }
        }
      }
    }
    this.gameState.turn = 'user';
  }

  async onCellClick(index) {
    if (this.locked) return false;
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
          await this.computerGame();
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
        await this.computerGame();
      }
    }
    this.selectedCell = null;
  }

  onCellEnter(index) {
    if (this.locked) return false;
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

  onNewGameClick() {
    this.userTeam = generateTeam([Bowman, Swordsman], 1, 2);
    this.computerTeam = generateTeam([Undead, Daemon, Vampire], 1, 2);
    this.players = [...this.userTeam, ...this.computerTeam];
    this.gamePlay.drawUi('prairie');
    this.gamePlay.redrawPositions(this.players);
    this.selectedCell = null;
    this.selectedMouseCell = null;
    this.selectedChar = null;
    this.level = 1;
    this.points = 0;
    this.locked = false;
  }

  gameOver() {
    this.locked = true;
    this.gamePlay.setCursor('not-allowed');
    if (this.points > this.gameState.points) {
      this.gameState.points = this.points;
    }
  }

  nextLevel() {
    this.level += 1;
    this.userTeam.forEach((el) => {
      this.points += el.character.health;
    });
    let newPositions = [];
    let newUserCharacters;

    const upgradeLevel = (el) => {
      if (el.character.level > 1) {
        const { level } = el.character;

        for (let l = 2; l <= level; l += 1) {
          GameController.levelUp(el.character);
        }
        el.character.level = level;
      }
    };

    const upgradePlayers = (number, userMaxLevel, computerMaxLevel) => {
      newUserCharacters = generateTeam([Bowman, Swordsman, Magician], userMaxLevel, number);
      newUserCharacters.forEach((el) => {
        newPositions.push(el.position);
        upgradeLevel(el);
      });
      this.userTeam.forEach((el) => {
        GameController.levelUp(el.character);
        el.position = getPosition(el.character);
        while (newPositions.includes(el.position)) {
          el.position = getPosition(el.character);
        }
      });
      this.userTeam = this.userTeam.concat(newUserCharacters);
      this.computerTeam = generateTeam([Undead, Daemon, Vampire], computerMaxLevel, this.userTeam.length);
      this.computerTeam.forEach((el) => upgradeLevel(el));
      this.players = [...this.userTeam, ...this.computerTeam];
    };

    switch (this.level) {
      case 2:
        this.gamePlay.drawUi('desert');
        upgradePlayers(1, 1, 2);
        break;
      case 3:
        this.gamePlay.drawUi('arctic');
        upgradePlayers(2, 2, 3);
        break;
      case 4:
        this.gamePlay.drawUi('mountain');
        upgradePlayers(2, 3, 4);
        break;
      default:
        this.gameOver();
        GamePlay.showMessage('Ура! Победа!');
    }
    newPositions = [];
  }
}
