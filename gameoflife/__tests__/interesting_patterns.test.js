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

  const newHabitat = blinkerHabitat.applyRules(rules.classic());
  expect(newHabitat).toMatchSnapshot('blinkerNextGeneration');

  const newerHabitat = newHabitat.applyRules(rules.classic());
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

  const newHabitat = blockHabitat.applyRules(rules.classic());
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
  const generation1 = generation0.applyRules(rules.classic());
  const generation2 = generation1.applyRules(rules.classic());
  const generation3 = generation2.applyRules(rules.classic());
  const generation4 = generation3.applyRules(rules.classic());

  expect(generation0).toMatchSnapshot('gliderGeneration0');
  expect(generation1).toMatchSnapshot('gliderGeneration1');
  expect(generation2).toMatchSnapshot('gliderGeneration2');
  expect(generation3).toMatchSnapshot('gliderGeneration3');
  expect(generation4).toMatchSnapshot('gliderGeneration4');
});
