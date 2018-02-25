module.exports = {
  print(val) {
    let output = '';

    for (let j = 0; j < val.h; j += 1) {
      for (let i = 0; i < val.w; i += 1) {
        output += (val.cells[j][i] > 0) ? '*' : '_';
      }
      output += '\n';
    }

    return output;
  },

  test(val) {
    return val && val.cells;
  },
};
