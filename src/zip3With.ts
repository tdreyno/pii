import PII from "./pii"
import unwrap from "./unwrap"

export default <A, B, C, D>(
  fn: (a: A, b: B, c: C) => D,
  a: PII<A> | A,
  b: PII<B> | B,
  c: PII<C> | C,
): PII<D> => PII(fn(unwrap(a), unwrap(b), unwrap(c)))
