export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function equal<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
  }
}

export function throws(action: () => unknown, message: string): void {
  let didThrow = false;
  try {
    action();
  } catch {
    didThrow = true;
  }
  assert(didThrow, message);
}

export function dateText(
  date: { readonly year: number; readonly month: number; readonly day: number },
): string {
  return `${String(date.year).padStart(4, "0")}-${String(date.month).padStart(2, "0")}-${
    String(date.day).padStart(2, "0")
  }`;
}
