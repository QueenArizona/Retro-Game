import info from '../info';

describe('info should return short info of ', () => {
  test('bowman character', () => {
    const result = info({
      character: {
        level: 2,
        attack: 25,
        defence: 25,
        health: 50,
        type: 'bowman',
      },
      position: 0,
    });

    expect(result).toEqual('\ud83c\udf96 2 \u2694 25 \ud83d\udee1 25 \u2764 50');
  });
  test('swordsman character', () => {
    const result = info({
      character: {
        level: 3,
        attack: 40,
        defence: 10,
        health: 50,
        type: 'swordsman',
      },
      position: 0,
    });

    expect(result).toEqual('\ud83c\udf96 3 \u2694 40 \ud83d\udee1 10 \u2764 50');
  });
});
