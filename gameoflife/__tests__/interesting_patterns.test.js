const habitat = require('../habitat');
const rules = require('../rules');

test('the blinker pattern should work correctly', () => {
  const blinkerCells = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];

  const blinkerHabitat = habitat.fromCells(blinkerCells);

  const newHabitat = blinkerHabitat.map(rules.classic);
  expect(newHabitat.cells).toMatchSnapshot('blinkerNextGeneration');

  const newerHabitat = newHabitat.map(rules.classic);
  expect(newerHabitat.cells).toEqual(blinkerCells);
});

test('the block pattern stays the same', () => {
  const blockCells = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ];

  const blockHabitat = habitat.fromCells(blockCells);

  const newHabitat = blockHabitat.map(rules.classic);
  expect(newHabitat.cells).toEqual(blockCells);
});
