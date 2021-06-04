/* eslint-disable @typescript-eslint/no-explicit-any */
// Class which wraps PII and keeps logging from accessing it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PII<T> {
  toString: () => string
  toJSON: () => string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPIIType = <T>(val: any): val is PII<T> =>
  isRecord(val) && val.__brand === "PII"

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

export function tap<T>(fn: (item: T) => void, item: PII<T>): PII<T>
export function tap<T>(fn: (item: T) => void, item: T): T
export function tap<T>(fn: (item: T) => void, item: PII<T> | T): PII<T> | T {
  fn(unwrap(item))

  return item
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

const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj === null || typeof obj !== "object" ? false : gpo(obj) === proto

// Function, regex, object, Number, String, etc
const isObject = (value: unknown): boolean => {
  const type = typeof value
  return value != null && (type == "object" || type == "function")
}

export const visitPII = <A, T>(
  input: A,
  visitors: {
    record: (value: Record<string, unknown>) => T
    map: (value: Map<unknown, unknown>) => T
    set: (value: Set<unknown>) => T
    object: (value: unknown) => T
    array: (value: Array<unknown>) => T
    primitive: (value: A) => T
  },
): T => {
  if (isRecord(input)) {
    return visitors.record(input)
  }

  if (Array.isArray(input)) {
    return visitors.array(input)
  }

  if (input instanceof Map) {
    return visitors.map(input)
  }

  if (input instanceof Set) {
    return visitors.set(input)
  }

  if (isObject(input)) {
    return visitors.object(input)
  }

  return visitors.primitive(input)
}

export const containsPII = (input: unknown): boolean =>
  isPIIType(input)
    ? true
    : visitPII(input, {
        record: o => Object.values(o).some(containsPII),
        map: m =>
          Array.from(m).some(([k, v]) => containsPII(k) || containsPII(v)),
        array: a => a.some(containsPII),
        set: s => Array.from(s).some(containsPII),
        primitive: p => isPIIType(p),
        object: p => isPIIType(p),
      })

export const unwrapObject = (input: unknown): unknown =>
  visitPII(isPIIType(input) ? unwrap(input) : input, {
    record: o =>
      Object.keys(o).reduce((sum, key) => {
        sum[key] = unwrapObject(o[key])
        return sum
      }, {} as Record<string, unknown>),
    map: m =>
      new Map(
        Array.from(m).map(([k, v]) => [unwrapObject(k), unwrapObject(v)]),
      ),
    array: a => a.map(unwrapObject),
    set: s => new Set(Array.from(s).map(unwrapObject)),
    primitive: p => p,
    object: p => p,
  })

export const redact = (redactor: (data: any) => any, input: unknown): unknown =>
  visitPII(isPIIType(input) ? redactor(input) : input, {
    record: o =>
      Object.keys(o).reduce((sum, key) => {
        sum[key] = redact(redactor, o[key])
        return sum
      }, {} as Record<string, unknown>),
    map: m =>
      new Map(
        Array.from(m).map(([k, v]) => [
          redact(redactor, k),
          redact(redactor, v),
        ]),
      ),
    array: a => a.map(x => redact(redactor, x)),
    set: s => new Set(Array.from(s).map(x => redact(redactor, x))),
    primitive: p => p,
    object: p => p,
  })
