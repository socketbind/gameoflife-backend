const Habitat = require('../habitat');

test('can create empty habitat', () => {
  const habitat = Habitat.empty(3, 3);
  expect(habitat).toBeDefined();
});

test('creates empty habitat with correct width and height', () => {
  const habitat = Habitat.empty(12, 16);
  expect(habitat.w).toEqual(12);
  expect(habitat.h).toEqual(16);
  expect(habitat.cells).toHaveLength(16);

  for (let j = 0; j < habitat.h; j += 1) {
    expect(habitat.cells[j]).toHaveLength(12);
  }
});

test('cannot create empty habitat with zero columns', () => {
  expect(() => {
    Habitat.empty(0, 15);
  }).toThrow(Habitat.ZeroSizeHabitat);

  expect(() => {
    Habitat.empty(11, 0);
  }).toThrow(Habitat.ZeroSizeHabitat);

  expect(() => {
    Habitat.empty(0, 0);
  }).toThrow(Habitat.ZeroSizeHabitat);
});

test('fromCells accepts valid array', () => {
  const originalArray = [[1, 0, 1], [0, 1, 0], [1, 1, 1]];
  const habitat = Habitat.fromCells(originalArray);

  expect(habitat).toBeDefined();
  expect(originalArray).toEqual(habitat.cells);
});

test('fromCells does not accept empty arrays', () => {
  expect(() => {
    Habitat.fromCells([]);
  }).toThrow(Habitat.EmptyArrayError);
});

test('fromCells does not accept malformed arrays', () => {
  expect(() => {
    Habitat.fromCells([[0, 1, 0], [0, 1], [1]]);
  }).toThrow(Habitat.MalformedArrayError);
});

test('fromCells does not accept arrays with values other than 0 or 1', () => {
  expect(() => {
    Habitat.fromCells([[123, 0, -1], [65535, 1, 0], [1, 1, 1]]);
  }).toThrow(Habitat.MalformedArrayError);
});

test('habitat cells can be accessed and access has a toroidal property', () => {
  const originalArray = [
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 1],
  ];
  const habitat = Habitat.fromCells(originalArray);
  expect(habitat).toBeDefined();

  for (let j = 0; j < 3; j += 1) {
    for (let i = 0; i < 3; i += 1) {
      expect(habitat.aliveAt(i, j)).toEqual(originalArray[j][i] > 0);
    }
  }

  expect(habitat.aliveAt(-1, -1)).toEqual(true);
  expect(habitat.aliveAt(0, -1)).toEqual(false);
  expect(habitat.aliveAt(1, -1)).toEqual(true);
  expect(habitat.aliveAt(2, -1)).toEqual(true);
  expect(habitat.aliveAt(3, -1)).toEqual(false);

  expect(habitat.aliveAt(3, 0)).toEqual(true);
  expect(habitat.aliveAt(3, 1)).toEqual(false);
  expect(habitat.aliveAt(3, 2)).toEqual(false);
  expect(habitat.aliveAt(3, 3)).toEqual(true);

  expect(habitat.aliveAt(-1, 3)).toEqual(true);
  expect(habitat.aliveAt(0, 3)).toEqual(true);
  expect(habitat.aliveAt(1, 3)).toEqual(false);
  expect(habitat.aliveAt(2, 3)).toEqual(true);

  expect(habitat.aliveAt(-1, 0)).toEqual(true);
  expect(habitat.aliveAt(-1, 1)).toEqual(false);
  expect(habitat.aliveAt(-1, 2)).toEqual(true);
  expect(habitat.aliveAt(-1, 3)).toEqual(true);
});

test('neighbor count is correct', () => {
  const originalArray = [
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 1],
  ];
  const habitat = Habitat.fromCells(originalArray);
  expect(habitat).toBeDefined();

  expect(habitat.neighbourCount(0, 0)).toEqual(4);
  expect(habitat.neighbourCount(1, 0)).toEqual(5);
  expect(habitat.neighbourCount(2, 0)).toEqual(4);

  expect(habitat.neighbourCount(0, 1)).toEqual(5);
  expect(habitat.neighbourCount(1, 1)).toEqual(4);
  expect(habitat.neighbourCount(2, 1)).toEqual(5);

  expect(habitat.neighbourCount(0, 2)).toEqual(5);
  expect(habitat.neighbourCount(1, 2)).toEqual(4);
  expect(habitat.neighbourCount(2, 2)).toEqual(4);
});

test('map function gets called correctly', () => {
  const originalArray = [
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 1],
  ];
  const habitat = Habitat.fromCells(originalArray);
  const mockRules = { cellSurvives: jest.fn().mockReturnValue(false) };

  const newHabitat = habitat.applyRules(mockRules);
  expect(newHabitat.cells).toEqual([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);

  expect(mockRules.cellSurvives.mock.calls).toHaveLength(9);
  expect(mockRules.cellSurvives.mock.calls).toEqual([
    [true, 4], [false, 5], [true, 4],
    [false, 5], [true, 4], [false, 5],
    [false, 5], [true, 4], [true, 4],
  ]);
});

test('map function return value works correctly', () => {
  const originalArray = [
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 1],
  ];
  const habitat = Habitat.fromCells(originalArray);
  expect(habitat.cells).toEqual(originalArray);

  const newHabitat1 = habitat.applyRules({ cellSurvives: () => true });
  expect(newHabitat1.cells).toEqual([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);

  const newHabitat2 = habitat.applyRules({ cellSurvives: () => false });
  expect(newHabitat2.cells).toEqual([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);

  let flop = true;
  const newHabitat3 = habitat.applyRules({
    cellSurvives: () => {
      flop = !flop;
      return flop;
    },
  });
  expect(newHabitat3.cells).toEqual([[0, 1, 0], [1, 0, 1], [0, 1, 0]]);
});
