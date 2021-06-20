export default <T extends any, U extends any>(fn: (a: T) => U) => (
  record: Record<string, T>,
) =>
  Object.keys(record).reduce((sum, key) => {
    sum[key] = fn(record[key])
    return sum
  }, {} as Record<string, U>)
