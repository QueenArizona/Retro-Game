export default function info(character) {
  const icons = {
    level: '\ud83c\udf96',
    attack: '\u2694',
    defence: '\ud83d\udee1',
    health: '\u2764',
  };

  return `${icons.level} ${character.character.level} ${icons.attack} ${character.character.attack} ${icons.defence} ${character.character.defence} ${icons.health} ${character.character.health}`;
}
