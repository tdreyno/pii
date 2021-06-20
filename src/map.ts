import PII from "./pii"
import unwrap from "./unwrap"

function map<T, T2>(fn: (item: T) => T2, item: PII<T>): PII<T2>
function map<T, T2>(fn: (item: T) => T2, item: T): Exclude<T2, PII<any>>
function map<T, T2>(
  fn: (item: T) => T2,
  item: PII<T> | T,
): PII<T2> | Exclude<T2, PII<any>> {
  return PII(fn(unwrap(item)))
}

export default map
