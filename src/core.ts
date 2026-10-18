// Initial capacity of the explicit DFS stack; it grows on demand.
const INITIAL_STACK_CAPACITY = 1024;

export function countComponents(grid: Uint8Array, width: number, height: number): number {
  const size = width * height;
  let stack = new Uint32Array(Math.min(size, INITIAL_STACK_CAPACITY));
  let figures = 0;

  for (let start = 0; start < size; start++) {
    if (grid[start] === 0) continue;

    figures++;
    grid[start] = 0;
    stack[0] = start;
    let top = 1;

    while (top > 0) {
      const index = stack[--top] as number;
      const column = index % width;

      // Make room for the (at most four) neighbours that may be pushed below.
      // The stack never needs more than `size` slots, since every cell is pushed at most once.
      if (top + 4 > stack.length && stack.length < size) {
        const grown = new Uint32Array(Math.min(size, stack.length * 2 + 4));
        grown.set(stack.subarray(0, top));
        stack = grown;
      }

      // Left
      if (column > 0 && grid[index - 1] === 1) {
        grid[index - 1] = 0;
        stack[top++] = index - 1;
      }
      // Right
      if (column < width - 1 && grid[index + 1] === 1) {
        grid[index + 1] = 0;
        stack[top++] = index + 1;
      }
      // Up
      if (index >= width && grid[index - width] === 1) {
        grid[index - width] = 0;
        stack[top++] = index - width;
      }
      // Down
      if (index + width < size && grid[index + width] === 1) {
        grid[index + width] = 0;
        stack[top++] = index + width;
      }
    }
  }

  return figures;
}
