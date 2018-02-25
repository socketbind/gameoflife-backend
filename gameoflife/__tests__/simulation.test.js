const simulation = require('../simulation');
const rules = require('../rules');
const habitat = require('../habitat');
const serializer = require('../test/habitat_snapshot_serializer');

expect.addSnapshotSerializer(serializer);

test('allows creating a basic blinker simulation', () => {
  const blinkerHabitat = habitat.fromCells([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const blinkerSimulation = new simulation.Simulation(blinkerHabitat, rules.classic(), 'Some description');
  expect(blinkerSimulation).toBeDefined();

  const nextState = blinkerSimulation.nextState();
  expect(nextState).toMatchSnapshot('blinkerNextState');
});

test('toJson serializes correctly', () => {
  const blinkerHabitat = habitat.fromCells([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const blinkerSimulation = new simulation.Simulation(blinkerHabitat, rules.classic(), 'Some description');

  expect(blinkerSimulation.toJson()).toEqual({
    description: 'Some description',
    habitat: ['_____', '_____', '_***_', '_____', '_____'],
    rules: { classic: true },
  });
});

test('fromJson deserializes correctly', () => {
  const input = {
    description: 'Some description',
    habitat: ['_____', '_____', '_***_', '_____', '_____'],
    rules: { custom: { survival: [1, 3, 5], birth: [2, 6] } },
  };

  const blinkerSimulation = simulation.fromJson(input);

  expect(blinkerSimulation.habitat.w).toEqual(5);
  expect(blinkerSimulation.habitat.h).toEqual(5);
  expect(blinkerSimulation.habitat.cells).toEqual([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  expect(blinkerSimulation.usedRule.constructor.name).toEqual('CustomRules');
  expect(blinkerSimulation.usedRule.survivalCounts).toEqual([1, 3, 5]);
  expect(blinkerSimulation.usedRule.birthCounts).toEqual([2, 6]);
  expect(blinkerSimulation.description).toEqual('Some description');
});

test('fromJson does not fail on missing description', () => {
  const input = {
    habitat: ['_____', '_____', '_***_', '_____', '_____'],
    rules: { classic: true },
  };

  const blinkerSimulation = simulation.fromJson(input);

  expect(blinkerSimulation.description).toEqual('');
});

test('fromJson does not fail on missing rules', () => {
  const input = {
    habitat: ['_____', '_____', '_***_', '_____', '_____'],
  };

  const blinkerSimulation = simulation.fromJson(input);

  expect(blinkerSimulation.habitat.w).toEqual(5);
  expect(blinkerSimulation.habitat.h).toEqual(5);
  expect(blinkerSimulation.habitat.cells).toEqual([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  expect(blinkerSimulation.usedRule.constructor.name).toEqual('ClassicRules');
});


test('fromJson fails on missing habitat', () => {
  const input = {
    description: 'Some description',
    rules: { classic: true },
  };

  expect(() => simulation.fromJson(input)).toThrow(/missing habitat key/);
});
