export async function measureDuration<T>(
  fn: () => Promise<T>,
): Promise<{ error?: Error; ms: number }> {
  const start = process.hrtime();
  try {
    await fn();
    const diff = process.hrtime(start);
    const ms = diff[0] * 1000 + diff[1] / 1e6;
    return { ms };
  } catch (error) {
    const diff = process.hrtime(start);
    const ms = diff[0] * 1000 + diff[1] / 1e6;
    const err = error instanceof Error ? error : new Error(String(error));
    return { error: err, ms };
  }
}
