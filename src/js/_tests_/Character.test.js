import Character from '../characters/Character';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import Daemon from '../characters/Daemon';

describe('new should ', () => {
  test('create new Bowman', () => {
    const bowman = new Bowman(1);

    expect(bowman).toEqual({
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      type: 'bowman',
      walkAbility: 2,
      attackAbility: 2,
    });
  });
  test('create new Swordsman', () => {
    const swordsman = new Swordsman(2);

    expect(swordsman).toEqual({
      level: 2,
      attack: 40,
      defence: 10,
      health: 50,
      type: 'swordsman',
      walkAbility: 4,
      attackAbility: 1,
    });
  });
  test('create new Magician', () => {
    const magician = new Magician(2);

    expect(magician).toEqual({
      level: 2,
      attack: 10,
      defence: 40,
      health: 50,
      type: 'magician',
      walkAbility: 1,
      attackAbility: 4,
    });
  });
  test('create new Undead', () => {
    const undead = new Undead(1);

    expect(undead).toEqual({
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      type: 'undead',
      walkAbility: 4,
      attackAbility: 1,
    });
  });
  test('create new Vampire', () => {
    const vampire = new Vampire(3);

    expect(vampire).toEqual({
      level: 3,
      attack: 40,
      defence: 10,
      health: 50,
      type: 'vampire',
      walkAbility: 2,
      attackAbility: 2,
    });
  });
  test('create new Daemon', () => {
    const daemon = new Daemon(4);

    expect(daemon).toEqual({
      level: 4,
      attack: 10,
      defence: 40,
      health: 50,
      type: 'daemon',
      walkAbility: 1,
      attackAbility: 4,
    });
  });
  test('return error if Character constructor is called', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const hero = new Character(2);
    }).toThrow();
  });
});
