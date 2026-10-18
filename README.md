# figure-counter

Counts the figures in a two-dimensional matrix: groups of marked cells connected through
their sides (top, bottom, left, right). Diagonal neighbours do not join figures.

- Zero runtime dependencies
- Works in Node.js (18+, both `import` and `require`) and in any modern browser
- Fully typed, strict TypeScript
- Linear time; a 1000x1000 matrix takes ~10–30 ms
- Iterative algorithm: no call-stack overflow, however large a figure is
- Never mutates the input

```text
A . . . .
A . B B .        countFigures(matrix) === 3
. B . B .
. B B B .
. . . . C
```

## Installation

npm install figure-counter

## Usage

```ts
import { countFigures } from 'figure-counter';

const matrix = [
  [true, false, false, false, false],
  [true, false, true, true, false],
  [false, true, false, true, false],
  [false, true, true, true, false],
  [false, false, false, false, true],
];

countFigures(matrix); // 3
```

```ts
countFigures([
  [true, false],
  [false, true],
]); // 2 — diagonal cells are separate figures
```

## API

### `countFigures(matrix)`

| Parameter | Type                                    | Description                                 |
| --------- | --------------------------------------- | ------------------------------------------- |
| `matrix`  | `ReadonlyArray<ReadonlyArray<boolean>>` | Rows of equal length, cells `true`/`false`. |

Returns the number of figures. An empty matrix (`[]` or rows with no cells) returns `0`.

Every cell must be strictly `true` or `false`. Values like `1`, `'1'`, `null` or `NaN` are
**not** coerced — they throw a `TypeError` instead, so unexpected data fails loudly rather
than being silently miscounted.

### Errors

| Error        | When                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `TypeError`  | The input is not an array of rows, a row is not an array, rows differ in length, or a cell is not `true`/`false`. |
| `RangeError` | The matrix has more than `MAX_CELLS` (2³² − 1) cells.                                                             |

## How it works

1. Validate and copy the input into a private `Uint8Array` (1 byte per cell). Every cell
   is checked exactly once — anything other than `true`/`false` throws immediately — the hot
   loop works on contiguous memory, and the caller's data is never touched.
2. Scan the grid. Each time a marked cell is found, the figure counter is incremented and
   the whole figure is flood-filled with an explicit stack (an `Uint32Array` that grows on
   demand).
3. Cells are cleared to `0` when they are pushed, so the grid doubles as the "visited" set
   and each cell enters the stack at most once.

**Complexity:** O(W × H) time. Memory is W × H bytes for the grid plus a stack that is bounded
by the size of the largest figure.

## How the build works

`npm run build` runs [`tsup`](https://tsup.egoist.dev/) against one entry point,
[`src/index.ts`](src/index.ts), configured in [`tsup.config.ts`](tsup.config.ts):

`format: ['esm', 'cjs']` tells it to produce both outputs from the same source in one pass:

```text
dist/index.js      ESM build    — for `import`
dist/index.cjs     CJS build    — for `require`
dist/index.d.ts    types for the ESM build
dist/index.d.cts   types for the CJS build
```

`import { countFigures } from 'figure-counter'` resolves to `dist/index.js`;
`require('figure-counter')` resolves to `dist/index.cjs`. Browsers go through the `import`
path too, either directly (`<script type="module">`) or via a bundler.

## Performance

`npm run bench` on a laptop (Node 20, median of 10 runs):

| Input                                | Time   |
| ------------------------------------ | ------ |
| 1000×1000 random, 10 % marked        | ~9 ms  |
| 1000×1000 random, 50 % marked        | ~20 ms |
| 1000×1000 random, 90 % marked        | ~24 ms |
| 1000×1000 single snake-shaped figure | ~12 ms |
| 1000×1000 fully marked               | ~22 ms |

## Compatibility

- Node.js 18+, via `import` (ES modules) or `require` (CommonJS) — see "How the build works"
- All modern browsers (output targets ES2018), via `<script type="module">` or any bundler
- Package exports: `dist/index.js` + `dist/index.d.ts` (ESM), `dist/index.cjs` +
  `dist/index.d.cts` (CJS)

## Development

```bash
npm install
npm test               # unit tests (Jest)
npm run test:coverage  # with coverage thresholds
npm run typecheck      # library (ES2018, no environment types) + tests
npm run lint           # ESLint, strict type-checked rules
npm run format         # Prettier
npm run build          # tsup -> dist/index.js (ESM) and dist/index.cjs (CJS), plus types
npm run smoke          # loads both built outputs and checks each returns the right answer
npm run bench          # performance benchmark
npm run check:package  # publint + "Are the types wrong?" checks
npm run verify         # everything above, as run in CI and before publishing
```

`npm pack --dry-run` shows exactly what would be published. The package is ready for
`npm publish`, which is intentionally not run.

## License

MIT
