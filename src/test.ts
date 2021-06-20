import PII from "./pii"
import unwrap from "./unwrap"

function test<T>(fn: (item: T) => boolean, item: PII<T>): boolean
function test<T>(fn: (item: T) => boolean, item: T): boolean
function test<T>(fn: (item: T) => boolean, item: PII<T> | T): boolean {
  return fn(unwrap(item))
}

export default test
