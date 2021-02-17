import checkOpportunity from '../checkOpportunity';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';

describe('checkOpportunity shoul return ', () => {
  test('false if cell is not open for bowman walkAbility', () => {
    const bowman = new Bowman();
    const result = checkOpportunity('move', 10, bowman, 13);

    expect(result).toEqual(false);
  });
  test('true if cell is open for magician walkAbility', () => {
    const magician = new Magician();
    const result = checkOpportunity('move', 18, magician, 27);

    expect(result).toEqual(true);
  });
  test('false if cell is not open for bowman attackAbility', () => {
    const bowman = new Bowman();
    const result = checkOpportunity('attack', 5, bowman, 10);

    expect(result).toEqual(false);
  });
  test('true if cell is open for swordman attackAbility', () => {
    const swordman = new Swordsman();
    const result = checkOpportunity('attack', 35, swordman, 44);

    expect(result).toEqual(true);
  });
  test('false if cell is not open for bowman attackAbility', () => {
    const bowman = new Bowman();
    const result = checkOpportunity('attack', 1, bowman, 25);

    expect(result).toEqual(false);
  });
  test('true if cell is open for magician attackAbility', () => {
    const magician = new Magician();
    const result = checkOpportunity('attack', 60, magician, 63);

    expect(result).toEqual(true);
  });
});
