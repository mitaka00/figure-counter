import { countFigures } from '../src/index.js';
import { createRandom, randomMatrix, snakeMatrix } from '../test/helpers.js';

const RUNS = 10;

function measure(label: string, run: () => number): void {
  run();
  const times: number[] = [];
  let result = 0;
  for (let i = 0; i < RUNS; i++) {
    const started = performance.now();
    result = run();
    times.push(performance.now() - started);
  }
  times.sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)] ?? 0;
  console.log(`${label} median ${median.toFixed(1)} ms figures: ${String(result)}`);
}

const random = createRandom(42);
const sparse = randomMatrix(1000, 1000, 0.1, random);
const half = randomMatrix(1000, 1000, 0.5, random);
const dense = randomMatrix(1000, 1000, 0.9, random);
const snake = snakeMatrix(1000);
const full = Array.from({ length: 1000 }, () => new Array<boolean>(1000).fill(true));

console.log(`countFigures, median of ${String(RUNS)} runs\n`);
measure('1000x1000 random, 10% marked', () => countFigures(sparse));
measure('1000x1000 random, 50% marked', () => countFigures(half));
measure('1000x1000 random, 90% marked', () => countFigures(dense));
measure('1000x1000 single snake (deepest DFS)', () => countFigures(snake));
measure('1000x1000 fully marked', () => countFigures(full));
