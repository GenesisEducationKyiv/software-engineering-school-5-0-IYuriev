export async function measureDuration<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; ms: number }> {
  const start = process.hrtime();
  const result = await fn();
  const duration = process.hrtime(start);
  const ms = duration[0] + duration[1] / 1e6;
  return { result, ms };
}
