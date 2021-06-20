import mapObject from "./mapObject"
import PII, { isPII } from "./pii"

const detect = (
  detector: (data: unknown) => boolean,
  input: unknown,
  maxDepth = Infinity,
): unknown => {
  if (maxDepth === 0) {
    return PII(input)
  }

  if (isPII(input)) {
    return input
  }

  if (detector(input)) {
    return PII(input)
  }

  return mapObject((v: unknown) => detect(detector, v, maxDepth - 1), input)
}

export default detect
