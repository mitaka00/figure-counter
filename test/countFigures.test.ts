import { countFigures, MAX_CELLS } from '../src/index.js';
import { createRandom, fromAscii, randomMatrix, snakeMatrix } from './helpers.js';

describe('countFigures', () => {
  describe('assignment example', () => {
    it('returns 3 for the matrix from the task description', () => {
      const matrix = fromAscii(
        '#....', // A
        '#.##.', // A  B B
        '.#.#.', //   B  B
        '.###.', //   B B B
        '....#', //          C
      );
      expect(countFigures(matrix)).toBe(3);
    });

    it('returns 3 for the equivalent literal boolean matrix', () => {
      expect(
        countFigures([
          [true, false, false, false, false],
          [true, false, true, true, false],
          [false, true, false, true, false],
          [false, true, true, true, false],
          [false, false, false, false, true],
        ]),
      ).toBe(3);
    });
  });

  describe('connectivity', () => {
    it.each([
      ['a single marked cell', ['#'], 1],
      ['a single unmarked cell', ['.'], 0],
      ['a fully marked matrix', ['###', '###', '###'], 1],
      ['a fully unmarked matrix', ['...', '...'], 0],
      ['horizontal neighbours', ['##'], 1],
      ['vertical neighbours', ['#', '#'], 1],
      ['diagonal neighbours (not connected)', ['#.', '.#'], 2],
      ['anti-diagonal neighbours (not connected)', ['.#', '#.'], 2],
      ['a checkerboard', ['#.#', '.#.', '#.#'], 5],
      ['a ring with a hole', ['###', '#.#', '###'], 1],
      ['a ring with a figure inside the hole', ['#####', '#...#', '#.#.#', '#...#', '#####'], 2],
      ['a U shape joined only at the bottom', ['#.#', '#.#', '###'], 1],
      ['figures touching every border', ['#.#', '...', '#.#'], 4],
      ['a single row', ['##.#..###'], 3],
      ['a single column', ['#', '.', '#', '#'], 2],
    ])('counts %s', (_name, rows, expected) => {
      expect(countFigures(fromAscii(...rows))).toBe(expected);
    });

    it('does not wrap around the right edge into the next row', () => {
      expect(countFigures(fromAscii('..#', '#..'))).toBe(2);
    });
  });

  describe('empty input', () => {
    it('returns 0 for an empty matrix', () => {
      expect(countFigures([])).toBe(0);
    });

    it('returns 0 for rows without columns', () => {
      expect(countFigures([[], [], []])).toBe(0);
    });
  });

  describe('purity', () => {
    it('does not mutate the input', () => {
      const matrix = fromAscii('##.', '.##', '#..');
      const snapshot = JSON.stringify(matrix);
      countFigures(matrix);
      expect(JSON.stringify(matrix)).toBe(snapshot);
    });

    it('returns the same result when called repeatedly', () => {
      const matrix = fromAscii('#.#', '###', '...');
      expect(countFigures(matrix)).toBe(1);
      expect(countFigures(matrix)).toBe(1);
    });
  });

  describe('validation', () => {
    it.each([
      ['null', null],
      ['undefined', undefined],
      ['a number', 42],
      ['a plain object', { length: 1 }],
    ])('rejects %s as the matrix', (_name, input) => {
      expect(() => countFigures(input as never)).toThrow(TypeError);
    });

    it.each([
      ['null', null],
      ['a number', 1],
      ['an object without length', {}],
      ['an object with a negative length', { length: -1 }],
      ['a typed array', new Uint8Array([1, 0])],
      ['a string', '##'],
    ])('rejects a row that is %s', (_name, row) => {
      expect(() => countFigures([[true], row] as never)).toThrow(/Row 1 is not an array/);
    });

    it('rejects jagged rows with a descriptive message', () => {
      expect(() => countFigures([[true, false], [true], [true, false]])).toThrow(
        'All rows must have the same length: row 0 has 2 cells, row 1 has 1.',
      );
    });

    it('rejects matrices with more cells than MAX_CELLS before allocating', () => {
      const wideRow = new Array(2 ** 16) as boolean[];
      const matrix = Array.from({ length: 2 ** 16 + 1 }, () => wideRow);
      expect(MAX_CELLS).toBe(2 ** 32 - 1);
      expect(() => countFigures(matrix)).toThrow(RangeError);
    });

    describe('non-boolean cells', () => {
      it.each([
        ['a number (1)', 1],
        ['a number (0)', 0],
        ["a string ('true')", 'true'],
        ['null', null],
        ['undefined', undefined],
        ['NaN', Number.NaN],
      ])('rejects %s as a cell value', (_name, cell) => {
        expect(() => countFigures([[true, cell]] as never)).toThrow(TypeError);
      });

      it('names the row and column in the error message', () => {
        expect(() =>
          countFigures([
            [true, true],
            [true, 1],
          ] as never),
        ).toThrow('Cell at row 1, column 1 is not a boolean.');
      });

      it('reports row 0, column 0 for the first cell', () => {
        expect(() => countFigures([['#']] as never)).toThrow(
          'Cell at row 0, column 0 is not a boolean.',
        );
      });
    });
  });

  describe('large inputs', () => {
    it('handles a 1000x1000 snake without overflowing the call stack', () => {
      expect(countFigures(snakeMatrix(1000))).toBe(1);
    });

    it('counts 250 000 isolated cells in a 1000x1000 grid', () => {
      const matrix = Array.from({ length: 1000 }, (_, row) =>
        Array.from({ length: 1000 }, (_, column) => row % 2 === 0 && column % 2 === 0),
      );
      expect(countFigures(matrix)).toBe(250_000);
    });

    it('processes a random 1000x1000 matrix well within a second', () => {
      const matrix = randomMatrix(1000, 1000, 0.5, createRandom(1));
      const started = performance.now();
      const figures = countFigures(matrix);
      const elapsed = performance.now() - started;
      expect(figures).toBeGreaterThan(0);
      expect(elapsed).toBeLessThan(1000);
    });

    it('handles very wide and very tall matrices', () => {
      // Each marked cell sits between two unmarked ones.
      expect(countFigures([Array.from({ length: 1_000_000 }, (_, i) => i % 3 === 1)])).toBe(
        333_333,
      );
      expect(countFigures(Array.from({ length: 1_000_000 }, () => [true]))).toBe(1);
    });
  });
});
