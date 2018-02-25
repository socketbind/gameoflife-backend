const habitat = require('../habitat');
const rules = require('../rules');
const serializer = require('../test/habitat_snapshot_serializer');

expect.addSnapshotSerializer(serializer);

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
  expect(newHabitat).toMatchSnapshot('blinkerNextGeneration');

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


test('the glider pattern travels correctly through the habitat', () => {
  const gliderCells = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ];
  const generation0 = habitat.fromCells(gliderCells);
  const generation1 = generation0.map(rules.classic);
  const generation2 = generation1.map(rules.classic);
  const generation3 = generation2.map(rules.classic);
  const generation4 = generation3.map(rules.classic);

  expect(generation0).toMatchSnapshot('gliderGeneration0');
  expect(generation1).toMatchSnapshot('gliderGeneration1');
  expect(generation2).toMatchSnapshot('gliderGeneration2');
  expect(generation3).toMatchSnapshot('gliderGeneration3');
  expect(generation4).toMatchSnapshot('gliderGeneration4');
});
