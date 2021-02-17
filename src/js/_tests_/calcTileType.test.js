import { calcTileType } from '../utils';

describe('calcTileType function should ', () => {
  test('return top-left if index = 0', () => {
    const result = calcTileType(0, 8);

    expect(result).toEqual('top-left');
  });
  test('return top if index = 4', () => {
    const result = calcTileType(4, 8);

    expect(result).toEqual('top');
  });
  test('return top-right if index = 7', () => {
    const result = calcTileType(7, 8);

    expect(result).toEqual('top-right');
  });
  test('return left if index = 24', () => {
    const result = calcTileType(24, 8);

    expect(result).toEqual('left');
  });
  test('return center if index = 36', () => {
    const result = calcTileType(36, 8);

    expect(result).toEqual('center');
  });
  test('return right if index = 39', () => {
    const result = calcTileType(39, 8);

    expect(result).toEqual('right');
  });
  test('return bottom-left if index = 56', () => {
    const result = calcTileType(56, 8);

    expect(result).toEqual('bottom-left');
  });
  test('return bottom if index = 59', () => {
    const result = calcTileType(59, 8);

    expect(result).toEqual('bottom');
  });
  test('return bottom-right for index = 63', () => {
    const result = calcTileType(63, 8);

    expect(result).toEqual('bottom-right');
  });
});
