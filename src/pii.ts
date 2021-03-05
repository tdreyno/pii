// Class which wraps PII and keeps logging from accessing it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PII<T> {
  toString: () => string
  toJSON: () => string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPIIType = <T>(val: any): val is PII<T> =>
  isPojo(val) && val.__brand === "PII"

export const PII = <T>(val: T): PII<T> =>
  isPIIType<T>(val)
    ? val
    : ({
        __brand: "PII",
        __fire_me_if_you_see_me_accessing_this_property_outside_pii_ts: val,
        toString: () => "PII<REDACTED>",
        toJSON: () => "PII<REDACTED>",
      } as PII<T>)

export const unwrap = <A>(item: PII<A>): A =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (item as any)[
    "__fire_me_if_you_see_me_accessing_this_property_outside_pii_ts"
  ]

export const map = <T, T2>(fn: (item: T) => T2, item: PII<T>): PII<T2> =>
  PII(fn(unwrap(item)))

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
): PII<B> => PII(a.map(unwrap).reduce(fn, initial))

export const zip2With = <A, B, C>(
  fn: (a: A, b: B) => C,
  a: PII<A>,
  b: PII<B>,
): PII<C> => PII(fn(unwrap(a), unwrap(b)))

export const zip3With = <A, B, C, D>(
  fn: (a: A, b: B, c: C) => D,
  a: PII<A>,
  b: PII<B>,
  c: PII<C>,
): PII<D> => PII(fn(unwrap(a), unwrap(b), unwrap(c)))

export const zip4With = <A, B, C, D, E>(
  fn: (a: A, b: B, c: C, d: D) => E,
  a: PII<A>,
  b: PII<B>,
  c: PII<C>,
  d: PII<D>,
): PII<E> => PII(fn(unwrap(a), unwrap(b), unwrap(c), unwrap(d)))

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
  isPIIType(input)
    ? true
    : visitPII(input, {
        object: o => Object.values(o).some(containsPII),
        array: a => a.some(containsPII),
        primitive: p => isPIIType(p),
      })

export const unwrapObject = (input: unknown): unknown =>
  visitPII(isPIIType(input) ? unwrap(input) : input, {
    object: o =>
      Object.keys(o).reduce((sum, key) => {
        sum[key] = unwrapObject(o[key])
        return sum
      }, {} as Record<string, unknown>),
    array: a => a.map(unwrapObject),
    primitive: p => p,
  })
