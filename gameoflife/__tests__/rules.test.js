const rules = require('../rules');

// Rules quoted from Wikipedia

test('adheres to original rules', () => {
  const classicRules = rules.classic();

  // Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
  expect(classicRules.cellSurvives(true, 1)).toEqual(false);
  expect(classicRules.cellSurvives(true, 0)).toEqual(false);

  // Any live cell with two or three live neighbours lives on to the next generation.
  expect(classicRules.cellSurvives(true, 2)).toEqual(true);
  expect(classicRules.cellSurvives(true, 2)).toEqual(true);

  // Any live cell with more than three live neighbours dies, as if by overpopulation.
  for (let i = 3; i <= 9; i += 1) {
    expect(classicRules.cellSurvives(true, 3)).toEqual(true);
  }

  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  expect(classicRules.cellSurvives(false, 3)).toEqual(true);
});

test('allows creating custom rules', () => {
  const customRules = rules.custom([1, 2, 5], [3, 6]);

  expect(customRules.cellSurvives(true, 0)).toEqual(false);
  expect(customRules.cellSurvives(true, 1)).toEqual(true);
  expect(customRules.cellSurvives(true, 2)).toEqual(true);
  expect(customRules.cellSurvives(true, 3)).toEqual(false);
  expect(customRules.cellSurvives(true, 4)).toEqual(false);
  expect(customRules.cellSurvives(true, 5)).toEqual(true);
  expect(customRules.cellSurvives(true, 6)).toEqual(false);
  expect(customRules.cellSurvives(true, 7)).toEqual(false);
  expect(customRules.cellSurvives(true, 8)).toEqual(false);

  expect(customRules.cellSurvives(false, 0)).toEqual(false);
  expect(customRules.cellSurvives(false, 1)).toEqual(false);
  expect(customRules.cellSurvives(false, 2)).toEqual(false);
  expect(customRules.cellSurvives(false, 3)).toEqual(true);
  expect(customRules.cellSurvives(false, 4)).toEqual(false);
  expect(customRules.cellSurvives(false, 5)).toEqual(false);
  expect(customRules.cellSurvives(false, 6)).toEqual(true);
  expect(customRules.cellSurvives(false, 7)).toEqual(false);
  expect(customRules.cellSurvives(false, 8)).toEqual(false);
});

test('fromJson() defaults to classic', () => {
  expect(rules.fromJson({}).name).toEqual('ClassicRules');
  expect(rules.fromJson({ rules: { classic: true } }).name).toEqual('ClassicRules');
  expect(rules.fromJson({ somethingelse: true }).name).toEqual('ClassicRules');
});

test('fromJson() deserializes custom properly', () => {
  const result = rules.fromJson({ rules: { custom: { survival: [1, 3, 5], birth: [2, 6] } } });
  expect(result.constructor.name).toEqual('CustomRules');
  expect(result.survivalCounts).toEqual([1, 3, 5]);
  expect(result.birthCounts).toEqual([2, 6]);
});
