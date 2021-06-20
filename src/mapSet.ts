export default <T extends any, U extends any>(fn: (a: T) => U) => (
  set: Set<T>,
) => new Set(Array.from(set).map(x => fn(x)))
