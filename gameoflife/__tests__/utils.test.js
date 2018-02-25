const utils = require('../utils');
const path = require('path');

const testDir = path.dirname(module.parent.filename);

test('readLines() can read existing file', () => {
  const existingFile = path.join(testDir, './simple_lines.txt');
  return expect(utils.readLines(existingFile)).resolves.toEqual(['first', 'second', 'third']);
});

test('readLines() throws error when file does not exist', () => expect(utils.readLines('does_not_exist')).rejects.toThrow(/ENOENT/));

test('emptyArrayWithSize() creates proper array', () => {
  const arr = utils.emptyArrayWithSize(3, 6);
  expect(arr).toHaveLength(6);

  for (let j = 0; j < arr.length; j += 1) {
    expect(arr[j]).toHaveLength(3);
    for (let i = 0; i < 3; i += 1) {
      expect(arr[j][i]).toEqual(0);
    }
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
