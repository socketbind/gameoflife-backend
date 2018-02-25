const utils = require('../utils');
const rules = require('../rules');
const habitat = require('../habitat');
const simulation = require('../simulation');

class InvalidFileFormatError extends Error {
}

const BLOCK_REGEX = /^#P (-?\d+) (-?\d+)$/;
const RULE_REGEX = /^#R (\d+)\/(\d+)$/;

function validBlockLine(line) {
  for (let i = 0; i < line.length; i += 1) {
    if (line[i] !== '.' && line[i] !== '*') {
      return false;
    }
  }

  return true;
}

function determineBlockDimension(rows) {
  return {
    w: rows.reduce((acc, val) => (val.length > acc ? val.length : acc), 0),
    h: rows.length,
  };
}

function padRowsAsNecessary(rows, w, char = '.') {
  return rows.map(row => row.padEnd(w, char));
}

function convertRowsToAppFormat(block) {
  return {
    ...block,
    rows: block.rows.map(row => row.split('').map(c => (c === '*' ? 1 : 0))),
  };
}

function convertToRectangularBlocks(block) {
  const dimensions = determineBlockDimension(block.rows);

  return {
    ...block,
    ...dimensions,
    rows: padRowsAsNecessary(block.rows, dimensions.w),
  };
}

function determineAllBlockBounds(blocks) {
  const ix = blocks.map(b => b.x);
  const iy = blocks.map(b => b.y);
  const iw = blocks.map(b => b.x + b.w);
  const ih = blocks.map(b => b.y + b.h);

  return {
    minX: Math.min(...ix),
    minY: Math.min(...iy),
    maxX: Math.max(...iw),
    maxY: Math.max(...ih),
  };
}

function translateBlocksToTheZeroOrigin(bounds) {
  return block => ({
    ...block,
    x: block.x - bounds.minX,
    y: block.y - bounds.minY,
  });
}

function copyCellBlock(block, target) {
  for (let cy = block.y, dy = (block.y + block.h) - 1; cy <= dy; cy += 1) {
    for (let cx = block.x, dx = (block.x + block.w) - 1; cx <= dx; cx += 1) {
      const bx = cx - block.x;
      const by = cy - block.y;

      // considering the contract of this function this is entirely permissible.
      target[cy][cx] = block.rows[by][bx]; // eslint-disable-line no-param-reassign
    }
  }

  return target;
}

function convertToAppSpecificCells(blocks) {
  const untranslatedBounds = determineAllBlockBounds(blocks);

  const cellBlocks = blocks
    .map(convertToRectangularBlocks)
    .map(translateBlocksToTheZeroOrigin(untranslatedBounds))
    .map(convertRowsToAppFormat);

  const translatedBounds = determineAllBlockBounds(cellBlocks);
  const finalArray = utils.emptyArrayWithSize(translatedBounds.maxX, translatedBounds.maxY);

  cellBlocks.forEach(block => copyCellBlock(block, finalArray));

  return finalArray;
}

function parseCoordinatesHashP(line) {
  return line
    .substring(3)
    .split(' ')
    .map(n => parseInt(n, 10));
}

function parseCustomRuleHashR(line) {
  const slashParts = line.substring(3).split('/');
  const survivalCounts = slashParts[0].split('').map(n => parseInt(n, 10));
  const birthCounts = slashParts[1].split('').map(n => parseInt(n, 10));

  return rules.custom(survivalCounts, birthCounts);
}

function parseLines(lines) {
  if (lines[0] !== '#Life 1.05') {
    throw new InvalidFileFormatError('only version 1.05 lif files are supported');
  }

  const description = [];
  const blocks = [];
  let insideBlock = false;

  let usedRules = rules.classic();

  lines.forEach((line) => {
    if (insideBlock) {
      if (validBlockLine(line)) {
        blocks[blocks.length - 1].rows.push(line);
      } else {
        insideBlock = false;
      }
    }

    if (line.startsWith('#D ')) { // description
      description.push(line.substring(3));
    } else if (BLOCK_REGEX.test(line)) { // block
      const coordinates = parseCoordinatesHashP(line);
      blocks.push({ x: coordinates[0], y: coordinates[1], rows: [] });
      insideBlock = true;
    } else if (line.startsWith('#N')) { // classic rules
      usedRules = rules.classic();
    } else if (RULE_REGEX.test(line)) { // custom rules
      usedRules = parseCustomRuleHashR(line);
    }
  });

  const cells = convertToAppSpecificCells(blocks);
  const finalDescription = description.length > 0 ? description.join('\n') : null;

  return new simulation.Simulation(habitat.fromCells(cells), usedRules, finalDescription);
}

/**
 * Load simulaton from v1.05 .lif files.
 * @param path absolute or relative path to .lif file
 * @returns {Promise<Simulation>} resolves to simulation or rejects with an error
 */
function loadFile(path) {
  return utils.readLines(path)
    .then(parseLines);
}

module.exports = {
  InvalidFileFormatError,
  loadFile,

  // considered to be internal but exposed for tests
  validBlockLine,
  determineBlockDimension,
  padRowsAsNecessary,
  convertRowsToAppFormat,
  convertToRectangularBlocks,
  determineAllBlockBounds,
  translateBlocksToTheZeroOrigin,
  copyCellBlock,
  convertToAppSpecificCells,
  parseCoordinatesHashP,
  parseCustomRuleHashR,
  parseLines,
};
