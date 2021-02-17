import Character from './Character';

export default class Undead extends Character {
  constructor(level, type = 'undead') {
    super(level, type);
    this.attack = 25;
    this.defence = 25;
    this.walkAbility = 4;
    this.attackAbility = 1;
  }
}
