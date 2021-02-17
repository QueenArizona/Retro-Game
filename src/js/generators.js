import getPosition from './getPosition';
import PositionedCharacter from './characters/PositionedCharacter';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randomLevel = Math.floor(Math.random() * maxLevel) + 1;
    const RandomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];

    yield new RandomType(randomLevel);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  const positions = [];

  for (let i = 0; i < characterCount; i += 1) {
    const character = characterGenerator(allowedTypes, maxLevel).next().value;
    let position = getPosition(character);

    while (positions.includes(position)) {
      position = getPosition(character);
    }
    positions.push(position);
    team.push(new PositionedCharacter(character, position));
  }
  return team;
}
