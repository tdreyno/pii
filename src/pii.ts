/* eslint-disable @typescript-eslint/no-explicit-any */
// Class which wraps PII and keeps logging from accessing it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PII<T> {
  toString: () => string
  toJSON: () => string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPIIType = <T>(val: any): val is PII<T> =>
  isPojo(val) && val.__brand === "PII"

export const PII = <T>(val: T, msg = "REDACTED"): PII<T> =>
  isPIIType<T>(val)
    ? val
    : ({
        __brand: "PII",
        __fire_me_if_you_see_me_accessing_this_property_outside_pii_ts: val,
        toString: () => `PII<${msg}>`,
        toJSON: () => `PII<${msg}>`,
      } as PII<T>)

export function unwrap<T>(item: PII<T>): Exclude<T, PII<any>>
export function unwrap<T>(item: T): Exclude<T, PII<any>>
export function unwrap<T>(item: T | PII<T>): Exclude<T, PII<any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return isPIIType(item)
    ? (item as any)[
        "__fire_me_if_you_see_me_accessing_this_property_outside_pii_ts"
      ]
    : item
}

export function map<T, T2>(fn: (item: T) => T2, item: PII<T>): PII<T2>
export function map<T, T2>(fn: (item: T) => T2, item: T): Exclude<T2, PII<any>>
export function map<T, T2>(
  fn: (item: T) => T2,
  item: PII<T> | T,
): PII<T2> | Exclude<T2, PII<any>> {
  return PII(fn(unwrap(item)))
}

export function test<T>(fn: (item: T) => boolean, item: PII<T>): boolean
export function test<T>(fn: (item: T) => boolean, item: T): boolean
export function test<T>(fn: (item: T) => boolean, item: PII<T> | T): boolean {
  return fn(unwrap(item))
}

export function fold<A, B>(
  fn: (
    previousValue: B,
    currentValue: A,
    currentIndex: number,
    array: A[],
  ) => B,
  initial: B,
  a: Array<PII<A> | A>,
): PII<B> {
  return PII(a.map<A>(unwrap).reduce(fn, initial))
}

export const zip2With = <A, B, C>(
  fn: (a: A, b: B) => C,
  a: PII<A> | A,
  b: PII<B> | B,
): PII<C> => PII(fn(unwrap(a), unwrap(b)))

export const zip3With = <A, B, C, D>(
  fn: (a: A, b: B, c: C) => D,
  a: PII<A> | A,
  b: PII<B> | B,
  c: PII<C> | C,
): PII<D> => PII(fn(unwrap(a), unwrap(b), unwrap(c)))

export const zip4With = <A, B, C, D, E>(
  fn: (a: A, b: B, c: C, d: D) => E,
  a: PII<A> | A,
  b: PII<B> | B,
  c: PII<C> | C,
  d: PII<D> | D,
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
