export default <K extends any, V extends any, T extends any, U extends any>(
  fn: (a: K | V) => T | U,
) => (map: Map<K, V>) =>
  new Map(Array.from(map).map(([k, v]) => [fn(k), fn(v)]))
