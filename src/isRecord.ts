const proto = Object.prototype
const gpo = Object.getPrototypeOf

export default (obj: unknown): obj is Record<string, unknown> =>
  obj === null || typeof obj !== "object" ? false : gpo(obj) === proto
