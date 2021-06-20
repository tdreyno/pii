import PII from "./pii"
import unwrap from "./unwrap"

export default <A, B, C, D, E>(
  fn: (a: A, b: B, c: C, d: D) => E,
  a: PII<A> | A,
  b: PII<B> | B,
  c: PII<C> | C,
  d: PII<D> | D,
): PII<E> => PII(fn(unwrap(a), unwrap(b), unwrap(c), unwrap(d)))
