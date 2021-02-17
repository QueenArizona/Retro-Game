export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.health = 50;
    this.type = type;
    if (new.target === Character) {
      throw Error('You cannot create new object of Character. Please, use inherited classes');
    }
  }
}
