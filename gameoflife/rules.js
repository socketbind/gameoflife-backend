/**
 * Represents the classic rules of Game of Life as described by Jon von Neumann.
 */
class ClassicRules {
  cellSurvives(alive, neighbourCount) {
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

  /**
   * Return the JSON representation of classic rules.
   * @returns {Object} JSON representation
   */
  toJson() {
    return { rules: { classic: true } };
  }
}

const classicRules = new ClassicRules();

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

  /**
   * Return the JSON representation of custom rules.
   * @returns {Object} JSON representation
   */
  static toJson() {
    return { rules: { custom: { survival: this.survivalCounts, birth: this.birthCounts } } };
  }
}

/**
 * Returns an object which represents the classical Game of Life rules described
 * by John von Neumann.
 * @returns {object} object representing the classical rules of the game of life
 */
function classic() {
  return classicRules;
}

/**
 * Returns an object which represents custom game rules with the specified parameters.
 * @param survivalCounts count of neighbors that is necessary for a cell's survival
 * @param birthCounts count of neighbors that is necessary allow a dead cell to become alive
 * @returns {Object} object representing custom rules for the game of life
 */
function custom(survivalCounts, birthCounts) {
  return new CustomRules(survivalCounts, birthCounts);
}

/**
 * Deserializes rules information from the specified object.
 * @param obj source object
 * @returns {Object} rule object
 */
function fromJson(obj) {
  if (obj.rules &&
    obj.rules.custom &&
    obj.rules.custom.survival &&
    obj.rules.custom.survival.constructor === Array &&
    obj.rules.custom.birth &&
    obj.rules.custom.birth.constructor === Array
  ) {
    return custom(
      obj.rules.custom.survival.filter(i => typeof i === 'number'),
      obj.rules.custom.birth.filter(i => typeof i === 'number')
    );
  }

  return classic();
}

module.exports = {
  classic,
  custom,
  fromJson
};
