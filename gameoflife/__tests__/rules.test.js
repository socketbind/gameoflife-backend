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
  for (let i = 3; i <= 9; i += 1) {
    expect(rules.classic(true, 3)).toEqual(true);
  }

  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  expect(rules.classic(false, 3)).toEqual(true);
});

test('allows creating custom rules', () => {
  const func = rules.custom([1, 2, 5], [3, 6]);

  expect(func(true, 0)).toEqual(false);
  expect(func(true, 1)).toEqual(true);
  expect(func(true, 2)).toEqual(true);
  expect(func(true, 3)).toEqual(false);
  expect(func(true, 4)).toEqual(false);
  expect(func(true, 5)).toEqual(true);
  expect(func(true, 6)).toEqual(false);
  expect(func(true, 7)).toEqual(false);
  expect(func(true, 8)).toEqual(false);

  expect(func(false, 0)).toEqual(false);
  expect(func(false, 1)).toEqual(false);
  expect(func(false, 2)).toEqual(false);
  expect(func(false, 3)).toEqual(true);
  expect(func(false, 4)).toEqual(false);
  expect(func(false, 5)).toEqual(false);
  expect(func(false, 6)).toEqual(true);
  expect(func(false, 7)).toEqual(false);
  expect(func(false, 8)).toEqual(false);
});
