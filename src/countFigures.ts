import { countComponents } from './core.js';
import type { Matrix } from './types.js';

// Cell indices are stored in a Uint32Array, so a grid may not exceed this many cells.
export const MAX_CELLS = 2 ** 32 - 1; //Max Uint32

export function countFigures(matrix: Matrix): number {
  if (!Array.isArray(matrix)) {
    throw new TypeError('Expected the matrix to be an array of rows.');
  }

  const height = matrix.length;
  if (height === 0) return 0;

  // Validate length of the rows
  const width = rowLength(matrix[0], 0);
  for (let row = 1; row < height; row++) {
    const length = rowLength(matrix[row], row);
    if (length !== width) {
      throw new TypeError(
        `All rows must have the same length: row 0 has ${width} cells, row ${row} has ${length}.`,
      );
    }
  }
  if (width === 0) return 0;

  // Validate max limit of the cells
  assertSize(width, height);

  const grid = new Uint8Array(width * height);

  // Copy into a compact private grid: every cell is checked exactly once
  for (let row = 0; row < height; row++) {
    const cells = matrix[row] as ReadonlyArray<unknown>;
    const offset = row * width;
    for (let column = 0; column < width; column++) {
      const cell = cells[column];
      if (typeof cell !== 'boolean') {
        throw new TypeError(`Cell at row ${row}, column ${column} is not a boolean.`);
      }
      if (cell) grid[offset + column] = 1;
    }
  }

  return countComponents(grid, width, height);
}

function rowLength(row: unknown, index: number): number {
  if (!Array.isArray(row)) {
    throw new TypeError(`Row ${index} is not an array.`);
  }
  return row.length;
}

function assertSize(width: number, height: number): void {
  if (width * height > MAX_CELLS) {
    throw new RangeError(`Matrix of ${width}x${height} exceeds the limit of ${MAX_CELLS} cells.`);
  }
}
