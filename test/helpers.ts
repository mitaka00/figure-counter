/** Builds a boolean matrix from ASCII art: `#` is marked, anything else is not. */
export function fromAscii(...rows: string[]): boolean[][] {
  return rows.map((row) => Array.from(row, (cell) => cell === '#'));
}

/**
 * Deterministic PRNG (the Park–Miller "minimal standard" generator), so random tests and
 * benchmarks are reproducible: `createRandom(1)` always produces the same sequence.
 *
 * The whole rule is one line: multiply the current state by a fixed constant, then take the
 * remainder modulo a large prime close to 2^31 — no bit-shifting, no magic hex constants.
 * 16807 and 2147483647 are the generator and the prime from the original 1988 paper; their
 * product never exceeds JavaScript's safe integer range, so plain `*` and `%` are exact.
 */
export function createRandom(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646; // 0 is a fixed point (0 * 16807 % prime === 0 forever)
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function randomMatrix(
  height: number,
  width: number,
  density: number,
  random: () => number,
): boolean[][] {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => random() < density),
  );
}

/** A single figure that snakes through the whole matrix (worst case for recursion depth). */
export function snakeMatrix(size: number): boolean[][] {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => {
      if (row % 2 === 0) return true; // full horizontal line
      // connector on alternating sides
      return row % 4 === 1 ? column === size - 1 : column === 0;
    }),
  );
}
