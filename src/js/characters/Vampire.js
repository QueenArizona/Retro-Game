import Character from './Character';

export default class Vampire extends Character {
  constructor(level, type = 'vampire') {
    super(level, type);
    this.attack = 40;
    this.defence = 10;
    this.walkAbility = 2;
    this.attackAbility = 2;
  }
}
