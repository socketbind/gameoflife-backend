const habitat = require('./habitat');
const rules = require('./rules');

/**
 * Represents the simulation of a cell culture.
 */
class Simulation {
  /**
   * Create a new simulation.
   * @param initialHabitat initial cell configuration to use
   * @param usedRules rules to use. @see {@link rules}
   * @param description description for this simulation
   */
  constructor(initialHabitat, usedRules, description) {
    this.habitat = initialHabitat;
    this.usedRule = usedRules;
    this.description = description || '';
  }

  /**
   * Compute next state using the rules specified in the constructor.
   * @returns {Habitat} habitat instance representing the next state.
   */
  nextState() {
    this.habitat = this.habitat.applyRules(this.usedRule);
    return this.habitat;
  }

  /**
   * Returns the JSON representation of this simulation.
   * @returns {Object} simulation JSON representation
   */
  toJson() {
    const fields = { // always present
      ...this.habitat.toJson(),
      ...this.usedRule.toJson(),
    };

    if (this.description) {
      fields.description = this.description;
    }

    return fields;
  }

  /**
   * Creates a Simulation instance from the specified object representation.
   * @returns {Object} simulation instance
   */
  static fromJson(obj) {
    const initialHabitat = habitat.fromJson(obj);
    const usedRules = rules.fromJson(obj);

    return new Simulation(initialHabitat, usedRules, obj.description);
  }
}

module.exports = {
  Simulation,
  fromJson: Simulation.fromJson,
};
