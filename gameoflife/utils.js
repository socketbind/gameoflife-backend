const fs = require('fs');

class InvalidArraySizeError extends Error {
  constructor() {
    super("creating zero dimension array is not allowed");
  }
}

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
