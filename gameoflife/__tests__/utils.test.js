const utils = require('../utils');
const path = require('path')

const testDir = path.dirname(module.parent.filename);

test('readLines() can read existing file', () => {
  const existingFile = path.join(testDir, './simple_lines.txt');
  return expect(utils.readLines(existingFile)).resolves.toEqual(['first', 'second', 'third']);
});

test('readLines() throws error when file does not exist', () => {
  return expect(utils.readLines('does_not_exist')).rejects.toThrow(/ENOENT/);
});

test('emptyArrayWithSize() creates proper array', () => {
  const arr = utils.emptyArrayWithSize(3, 6);
  expect(arr.length).toEqual(6);

  for (let i = 0; i < arr.length; i += 1) {
    expect(arr[i].length).toEqual(3);
  }
});

test('emptyArrayWithSize() does not allow to create zero width or height arrays', () => {
  expect(() => utils.emptyArrayWithSize(0, 0)).toThrow(utils.InvalidArraySizeError);
  expect(() => utils.emptyArrayWithSize(11, 0)).toThrow(utils.InvalidArraySizeError);
  expect(() => utils.emptyArrayWithSize(0, 22)).toThrow(utils.InvalidArraySizeError);

  expect(() => utils.emptyArrayWithSize(-20, 22)).toThrow(utils.InvalidArraySizeError);
  expect(() => utils.emptyArrayWithSize(0, -22)).toThrow(utils.InvalidArraySizeError);
  expect(() => utils.emptyArrayWithSize(-30, -22)).toThrow(utils.InvalidArraySizeError);
});
