const fs = require('fs');

/**
 * Thrown when the user is attempting to create an invalid array (zero or negative dimensions).
 */
class InvalidArraySizeError extends Error {
  constructor() {
    super('creating zero or negative dimension array is not allowed');
  }
}

/**
 * Reads the specified file.
 * @param path relative or absolute path of the file
 * @returns {Promise<Array<string>>} promise resolving to an string array of lines or
 * rejects with an error
 */
function readLines(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.split(/\r?\n/));
      }
    });
  });
}

/**
 * Creates an empty array with the specified with an height. Values are undefined
 * by default (as is with Array(n)). Rows can be accessed by the first index.
 * @param w width of the array
 * @param h height of the array
 * @returns {any[]} array instance with the specified dimensions
 */
function emptyArrayWithSize(w, h) {
  if (w === 0 || h === 0) {
    throw new InvalidArraySizeError();
  }

  if (w < 0 || h < 0) {
    throw new InvalidArraySizeError();
  }

  const arr = new Array(h);
  for (let j = 0; j < h; j += 1) {
    arr[j] = new Array(w);
  }
  return arr;
}

module.exports = { readLines, emptyArrayWithSize, InvalidArraySizeError };
