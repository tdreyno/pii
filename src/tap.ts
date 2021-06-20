import PII from "./pii"
import unwrap from "./unwrap"

function tap<T>(fn: (item: T) => void, item: PII<T>): PII<T>
function tap<T>(fn: (item: T) => void, item: T): T
function tap<T>(fn: (item: T) => void, item: PII<T> | T): PII<T> | T {
  fn(unwrap(item))

  return item
}

export default tap
