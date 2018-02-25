const parsers = require('../');
const path = require('path');
const serializer = require('../../test/habitat_snapshot_serializer');

expect.addSnapshotSerializer(serializer);

const testDir = path.dirname(module.parent.filename);

test('can load life1.05 files', () => {
  const testFile = path.join(testDir, 'lif', 'max.lif');

  const simulation = parsers.lif.loadFile(testFile);
  return expect(simulation).resolves.toMatchSnapshot('loaded adder simulation');
});

test('fails gracefully when file does not exist', () => {
  const simulation = parsers.lif.loadFile('doesnotexist');
  return expect(simulation).rejects.toThrow(/ENOENT/);
});
