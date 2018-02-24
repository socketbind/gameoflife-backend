const rules = require('../rules');

// Rules quoted from Wikipedia

test('adheres to original rules', () => {
  // Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
  expect(rules.classic(true, 1)).toEqual(false);
  expect(rules.classic(true, 0)).toEqual(false);

  // Any live cell with two or three live neighbours lives on to the next generation.
  expect(rules.classic(true, 2)).toEqual(true);
  expect(rules.classic(true, 2)).toEqual(true);

  // Any live cell with more than three live neighbours dies, as if by overpopulation.
  for (let i = 3; i <= 9; i++) {
    expect(rules.classic(true, 3)).toEqual(true);
  }

  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  expect(rules.classic(false, 3)).toEqual(true);
});
