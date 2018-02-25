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
    this.used_rule = usedRules;
    this.description = description || '';
  }

  nextState() {
    this.habitat = this.habitat.applyRules(this.used_rule);
    return this.habitat;
  }
}

module.exports = { Simulation };
