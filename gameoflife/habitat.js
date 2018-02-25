const utils = require('./utils');

/**
 * Thrown when an empty array is provided as a paramter for creation factory functions.
 */
class EmptyArrayError extends Error {
  constructor() {
    super('fromCells does not accept empty arrays');
  }
}

/**
 * Thrown when the array provided is malformed in some regard (bad dimensions, values).
 */
class MalformedArrayError extends Error {
  constructor() {
    super('array must have the proper dimension and contain only boolean values');
  }
}

/**
 * Thrown when the callee attempts to create an empty habitat.
 */
class ZeroSizeHabitat extends Error {
  constructor() {
    super('cannot create zero length habitat');
  }
}

class Habitat {
  /**
   * Creates a new habitat.
   * @param w number of cells horizontally
   * @param h number of cells vertically
   * @param cells initial cell configuration, if not specified create an empty habitat
   */
  constructor(w, h, cells) {
    this.w = w;
    this.h = h;

    if (cells) {
      this.cells = cells;
    } else {
      this.cells = utils.emptyArrayWithSize(w, h);
    }
  }

  /**
   * Check whether there is an alive cell at the specified coordinates.
   * @param x horizontal position
   * @param y vertical position
   * @returns {boolean} if cell is alive, false otherwise
   */
  aliveAt(x, y) {
    let fx = (x % this.w);
    let fy = (y % this.h);
    if (fx < 0) {
      fx = this.w + fx;
    }
    if (fx >= this.w) {
      fx -= this.w;
    }
    if (fy < 0) {
      fy = this.h + fy;
    }
    if (fy >= this.h) {
      fy -= this.h;
    }

    return this.cells[fy][fx] > 0;
  }

  /**
   * Counts the number of neighbours at the specified position.
   * @param x horizontal position
   * @param y vertical position
   * @returns {int} neighbour count
   */
  neighbourCount(x, y) {
    return this.aliveAt(x - 1, y - 1) + this.aliveAt(x, y - 1) + this.aliveAt(x + 1, y - 1) +
      this.aliveAt(x - 1, y) + this.aliveAt(x + 1, y) +
      this.aliveAt(x - 1, y + 1) + this.aliveAt(x, y + 1) + this.aliveAt(x + 1, y + 1);
  }

  /**
   * Execute the specified rules on cells contained in this habitat
   * and create a new habitat from the results.
   * @param rules an arbitrary object with a cellSurvives(alive, neighbourCount) method
   * @returns {Habitat} new habitat containing the resulting cells
   */
  applyRules(rules) {
    const result = utils.emptyArrayWithSize(this.w, this.h);
    for (let j = 0; j < this.h; j += 1) {
      for (let i = 0; i < this.w; i += 1) {
        result[j][i] = rules.cellSurvives(this.aliveAt(i, j), this.neighbourCount(i, j)) ? 1 : 0;
      }
    }
    return Habitat.fromCells(result);
  }

  /**
   * Creates a new habitat containing the specified cells.
   * @param cells cells encoded as an array of rows
   * @returns {Habitat} habitat instance containing the cells
   */
  static fromCells(cells) {
    if (cells.length === 0) {
      throw new EmptyArrayError();
    }

    const w = cells[0].length;
    const h = cells.length;

    for (let j = 1; j < h; j += 1) {
      if (cells[j].length !== w) {
        throw new MalformedArrayError();
      }
      for (let i = 0; i < w; i += 1) {
        if (![0, 1].includes(cells[j][i])) {
          throw new MalformedArrayError();
        }
      }
    }

    return new Habitat(w, h, cells);
  }

  /**
   * Create an empty habitat with the specified width and height.
   * @param w habitat width
   * @param h habitat height
   * @returns {Habitat} empty habitat instance
   */
  static empty(w, h) {
    if (w === 0) {
      throw new ZeroSizeHabitat();
    }

    if (h === 0) {
      throw new ZeroSizeHabitat();
    }

    return new Habitat(w, h);
  }
}

module.exports = {
  fromCells: Habitat.fromCells,
  empty: Habitat.empty,
  EmptyArrayError,
  MalformedArrayError,
  ZeroSizeHabitat,
};
