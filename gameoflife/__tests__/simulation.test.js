const simulation = require('../simulation');
const rules = require('../rules');
const habitat = require('../habitat');
const serializer = require('./utils/habitat_snapshot_serializer');

expect.addSnapshotSerializer(serializer);

test('allows creating a basic blinker simulation', () => {
  const blinkerCells = habitat.fromCells([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const blinkerSimulation = new simulation.Simulation(blinkerCells, rules.classic, 'Some description');
  expect(blinkerSimulation).toBeDefined();

  const nextState = blinkerSimulation.nextState();
  expect(nextState).toMatchSnapshot('blinkerNextState');
});
