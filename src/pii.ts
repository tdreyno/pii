// Class which wraps PII and keeps logging from accessing it.
class PII<T> {
  constructor(
    private _fire_me_if_you_see_me_accessing_this_property_outside_pii_ts: T,
  ) { }

  toString() {
    return "PII<REDACTED>"
  }
}

const markPII = <T>(value: T): PII<T> => new PII(value)

export const unwrap = <A>(item: PII<A>): A =>
  item["_fire_me_if_you_see_me_accessing_this_property_outside_pii_ts"]

export const map = <T, T2>(fn: (item: T) => T2, item: PII<T>): PII<T2> =>
  markPII(fn(unwrap(item)))

export const test = <T>(fn: (item: T) => boolean, item: PII<T>): boolean =>
  fn(unwrap(item))

export const fold = <A, B>(
  fn: (
    previousValue: B,
    currentValue: A,
    currentIndex: number,
    array: A[],
  ) => B,
  initial: B,
  a: Array<PII<A>>,
): PII<B> => markPII(a.map(unwrap).reduce(fn, initial))

export const zipWith = <A, B, C>(
  fn: (a: A, b: B) => C,
  a: PII<A>,
  b: PII<B>,
): PII<C> => markPII(fn(unwrap(a), unwrap(b)))

const proto = Object.prototype
const gpo = Object.getPrototypeOf

// POJO: Plain Old Javascript Object
const isPojo = (obj: unknown): obj is Record<string, unknown> =>
  obj === null || typeof obj !== "object" ? false : gpo(obj) === proto

// Does not handle Set or Map for now.
const visitPII = <A, T>(
  input: A,
  visitors: {
    object: (value: Record<string, unknown>) => T
    array: (value: Array<unknown>) => T
    primitive: (value: A) => T
  },
): T => {
  if (isPojo(input)) {
    return visitors.object(input)
  }

  if (Array.isArray(input)) {
    return visitors.array(input)
  }

  return visitors.primitive(input)
}

export const containsPII = (input: unknown): boolean =>
  visitPII(input, {
    object: o => Object.values(o).some(containsPII),
    array: a => a.some(containsPII),
    primitive: p => p instanceof PII,
  })

// Does not handle Set or Map for now.
export const unwrapObject = (input: unknown): any =>
  visitPII(input, {
    object: o =>
      Object.keys(o).reduce((sum, key) => {
        sum[key] = unwrapObject(o[key])
        return sum
      }, {} as Record<string, unknown>),
    array: a => a.map(unwrapObject),
    primitive: p => (p instanceof PII ? unwrap(p) : p),
  })

export default markPII
