const parser = require('../lif_v105');
const simulation = require('../../simulation');
const utils = require('../../utils');
const serializer = require('../../test/habitat_snapshot_serializer');

expect.addSnapshotSerializer(serializer);

test('validates block lines properly', () => {
  expect(parser.validBlockLine('....***...')).toEqual(true);
  expect(parser.validBlockLine('    ....***...')).toEqual(false);
  expect(parser.validBlockLine('....***...      ')).toEqual(false);
  expect(parser.validBlockLine('     ....***...      ')).toEqual(false);
  expect(parser.validBlockLine('asadgvsdvb.bb..***')).toEqual(false);
});

test('determines the dimensions of uneven blocks properly', () => {
  expect(parser.determineBlockDimension([
    [0],
    [0, 0],
    [0, 0, 0],
  ])).toEqual({ w: 3, h: 3 });

  expect(parser.determineBlockDimension([
    [0, 0, 0],
    [0, 0],
    [0],
  ])).toEqual({ w: 3, h: 3 });

  expect(parser.determineBlockDimension([
    [0, 0, 0],
    [0, 0],
    [0, 0, 0],
  ])).toEqual({ w: 3, h: 3 });
});

test('pads rows properly', () => {
  const input = [
    '.**',
    '.',
    '.*...',
  ];

  expect(parser.padRowsAsNecessary(input, 6)).toEqual([
    '.**...',
    '......',
    '.*....',
  ]);
});

test('converts properly to application format', () => {
  const input = {
    rows: [
      '.**....',
      '.....**',
      '**.....',
    ],
  };

  expect(parser.convertRowsToAppFormat(input)).toEqual({
    rows: [
      [0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0],
    ],
  });
});


test('converts to rectangular blocks properly', () => {
  const input = {
    rows: [
      '.**',
      '.',
      '.*...',
    ],
  };

  expect(parser.convertToRectangularBlocks(input)).toEqual({
    rows: [
      '.**..',
      '.....',
      '.*...',
    ],
    w: 5,
    h: 3,
  });
});

test('determines the bounds of all blocks properly', () => {
  const input = [{
    x: -5,
    y: 2,
    w: 6,
    h: 4,
  }, {
    x: 0,
    y: -2,
    w: 11,
    h: 8,
  }, {
    x: -1,
    y: 0,
    w: 13,
    h: 61,
  }];

  expect(parser.determineAllBlockBounds(input)).toEqual({
    minX: -5,
    minY: -2,
    maxX: 12,
    maxY: 61,
  });
});

test('translates to the origin properly', () => {
  const input = [{
    x: -5,
    y: 2,
    w: 6,
    h: 4,
  }, {
    x: 0,
    y: -2,
    w: 11,
    h: 8,
  }, {
    x: -1,
    y: 0,
    w: 13,
    h: 61,
  }];

  const output = input.map(parser.translateBlocksToTheZeroOrigin({ minX: -6, minY: -3 }));
  expect(output).toEqual([{
    x: 1,
    y: 5,
    w: 6,
    h: 4,
  }, {
    x: 6,
    y: 1,
    w: 11,
    h: 8,
  }, {
    x: 5,
    y: 3,
    w: 13,
    h: 61,
  }]);
});

test('copies cell blocks properly', () => {
  const target = utils.emptyArrayWithSize(6, 6);

  const block = {
    x: 1,
    y: 2,
    w: 3,
    h: 4,
    rows: [
      [0, 1, 0],
      [1, 0, 1],
      [1, 1, 1],
      [1, 1, 0],
    ],
  };

  parser.copyCellBlock(block, target);

  expect(target).toEqual([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 0],
  ]);
});

test('parses valid hash P lines properly', () => {
  expect(parser.parseCoordinatesHashP('#P -5 17')).toEqual([-5, 17]);
});

test('parses valid hash R lines properly', () => {
  const rules = parser.parseCustomRuleHashR('#R 125/36');

  expect(rules.cellSurvives(true, 0)).toEqual(false);
  expect(rules.cellSurvives(true, 1)).toEqual(true);
  expect(rules.cellSurvives(true, 2)).toEqual(true);
  expect(rules.cellSurvives(true, 3)).toEqual(false);
  expect(rules.cellSurvives(true, 4)).toEqual(false);
  expect(rules.cellSurvives(true, 5)).toEqual(true);
  expect(rules.cellSurvives(true, 6)).toEqual(false);
  expect(rules.cellSurvives(true, 7)).toEqual(false);
  expect(rules.cellSurvives(true, 8)).toEqual(false);

  expect(rules.cellSurvives(false, 0)).toEqual(false);
  expect(rules.cellSurvives(false, 1)).toEqual(false);
  expect(rules.cellSurvives(false, 2)).toEqual(false);
  expect(rules.cellSurvives(false, 3)).toEqual(true);
  expect(rules.cellSurvives(false, 4)).toEqual(false);
  expect(rules.cellSurvives(false, 5)).toEqual(false);
  expect(rules.cellSurvives(false, 6)).toEqual(true);
  expect(rules.cellSurvives(false, 7)).toEqual(false);
  expect(rules.cellSurvives(false, 8)).toEqual(false);
});

test('parses lines correctly', () => {
  const lines = [
    '#Life 1.05',
    '#D some description',
    '#D next line of description',
    '#R 125/36',
    '#P -3 -4',
    '.',
    '.***.',
    '.',
  ];

  const result = parser.parseLines(lines);

  expect(result).toBeInstanceOf(simulation.Simulation);
  expect(result.description).toEqual('some description\nnext line of description');

  expect(result.usedRule.cellSurvives(true, 0)).toEqual(false);
  expect(result.usedRule.cellSurvives(true, 1)).toEqual(true);
  expect(result.usedRule.cellSurvives(true, 2)).toEqual(true);
  expect(result.usedRule.cellSurvives(true, 3)).toEqual(false);
  expect(result.usedRule.cellSurvives(true, 4)).toEqual(false);
  expect(result.usedRule.cellSurvives(true, 5)).toEqual(true);
  expect(result.usedRule.cellSurvives(true, 6)).toEqual(false);
  expect(result.usedRule.cellSurvives(true, 7)).toEqual(false);
  expect(result.usedRule.cellSurvives(true, 8)).toEqual(false);

  expect(result.usedRule.cellSurvives(false, 0)).toEqual(false);
  expect(result.usedRule.cellSurvives(false, 1)).toEqual(false);
  expect(result.usedRule.cellSurvives(false, 2)).toEqual(false);
  expect(result.usedRule.cellSurvives(false, 3)).toEqual(true);
  expect(result.usedRule.cellSurvives(false, 4)).toEqual(false);
  expect(result.usedRule.cellSurvives(false, 5)).toEqual(false);
  expect(result.usedRule.cellSurvives(false, 6)).toEqual(true);
  expect(result.usedRule.cellSurvives(false, 7)).toEqual(false);
  expect(result.usedRule.cellSurvives(false, 8)).toEqual(false);

  expect(result.habitat).toMatchSnapshot('initial status after parseLines');
});
