# Game of Life Backend

Start by installing development dependencies:
```
npm install
```

Run tests by issuing:
```
npm test
```

Implemented features:
* Basic simulation.
* .lif v1.05 format support with custom rules.
* Simulation state serialization/deserialization.

Tests are written using Jest. Simluation tests are using the snapshot feature of Jest with a custom serializer in order to make it easier to debug transitions.

Most of the source code is covered with JSDoc documentation.
