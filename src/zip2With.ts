import PII from "./pii"
import unwrap from "./unwrap"

export default <A, B, C>(
  fn: (a: A, b: B) => C,
  a: PII<A> | A,
  b: PII<B> | B,
): PII<C> => PII(fn(unwrap(a), unwrap(b)))
