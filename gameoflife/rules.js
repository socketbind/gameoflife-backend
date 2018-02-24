/**
 * Mapping function for the classical Game of Life rules described by John von Neumann.
 * @param alive cell status as passed by the map() function in the Habitat class
 * @param neighbourCount neighbor count as passed bby the map() function in the Habitat class
 * @returns {boolean} whether the cell will survive to the next generation or not
 */
function classic(alive, neighbourCount) {
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

module.exports = {
  classic,
};
