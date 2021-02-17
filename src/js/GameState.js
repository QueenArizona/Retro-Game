export default class GameState {
  constructor() {
    this.turn = 'user';
  }

  static from(object) {
    if (typeof object === 'object') return object;
    return null;
  }
}
