import { isPII } from "./pii"
import mapObject from "./mapObject"

const redact = (
  redactor: (data: any) => any,
  input: unknown,
  maxDepth = Infinity,
): unknown => {
  if (maxDepth === 0) {
    return redactor(input)
  }

  return mapObject(
    (v: unknown) => redact(redactor, v, maxDepth - 1),
    isPII(input) ? redactor(input) : input,
  )
}

export default redact
