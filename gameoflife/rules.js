/**
 * Represents the classic rules of Game of Life as described by Jon von Neumann.
 */
class ClassicRules {
  static cellSurvives(alive, neighbourCount) {
    if (alive) {
      if (neighbourCount < 2) { // underpopulation
        return false;
      } else if (neighbourCount <= 3) { // survival
        return true;
      }

      return false; // overpopulation
    } else if (neighbourCount === 3) { // reproduction
      return true;
    }

    return false;
  }
}

/**
 * Represents custom rules for the Game of Life.
 */
class CustomRules {
  /**
   * Creates a custom rule instance.
   * @param survivalCounts count of neighbors that is necessary for a cell's survival
   * @param birthCounts count of neighbors that is necessary allow a dead cell to become alive
   */
  constructor(survivalCounts, birthCounts) {
    this.survivalCounts = survivalCounts;
    this.birthCounts = birthCounts;
  }

  cellSurvives(alive, neighbourCount) {
    if (alive) {
      return this.survivalCounts.includes(neighbourCount);
    }

    return this.birthCounts.includes(neighbourCount);
  }
}

/**
 * Returns an object which represents the classical Game of Life rules described
 * by John von Neumann.
 * @returns {object} object representing the classical rules of the game of life
 */
function classic() {
  return ClassicRules;
}

/**
 * Returns an object which represents custom game rules with the specified parameters.
 * @param survivalCounts count of neighbors that is necessary for a cell's survival
 * @param birthCounts count of neighbors that is necessary allow a dead cell to become alive
 * @returns {object} object representing custom rules for the game of life
 */
function custom(survivalCounts, birthCounts) {
  return new CustomRules(survivalCounts, birthCounts);
}

module.exports = {
  classic,
  custom,
};
