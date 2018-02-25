const lifv105 = require('./parsers/lif_v105');

module.exports = {
  lif: { loadFile: lifv105.loadFile },
};
