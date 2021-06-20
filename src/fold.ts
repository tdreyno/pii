import PII from "./pii"
import unwrap from "./unwrap"

export default <A, B>(
  fn: (
    previousValue: B,
    currentValue: A,
    currentIndex: number,
    array: A[],
  ) => B,
  initial: B,
  a: Array<PII<A> | A>,
): PII<B> => PII(a.map<A>(unwrap).reduce(fn, initial))
