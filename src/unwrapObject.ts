import mapObject from "./mapObject"
import { isPII } from "./pii"
import unwrap from "./unwrap"

const unwrapObject = (input: unknown, maxDepth = Infinity): unknown => {
  if (maxDepth === 0) {
    return null
  }

  return mapObject(
    (v: unknown) => unwrapObject(v, maxDepth - 1),
    isPII(input) ? unwrap(input) : input,
  )
}

export default unwrapObject
