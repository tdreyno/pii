import PII, { isPII } from "./pii"
import visit from "./visit"

const detect = (
  detector: (data: unknown) => boolean,
  input: unknown,
  maxDepth = Infinity,
): unknown =>
  isPII(input)
    ? input
    : detector(input) || maxDepth === 0
    ? PII(input)
    : visit(input, {
        record: r =>
          Object.keys(r).reduce((sum, key) => {
            sum[key] = detect(detector, r[key], maxDepth - 1)
            return sum
          }, {} as Record<string, unknown>),
        map: m =>
          new Map(
            Array.from(m).map(([k, v]) => [
              detect(detector, k, maxDepth - 1),
              detect(detector, v, maxDepth - 1),
            ]),
          ),
        array: a => a.map(x => detect(detector, x, maxDepth - 1)),
        set: s =>
          new Set(Array.from(s).map(x => detect(detector, x, maxDepth - 1))),
        primitive: p => p,
        object: o => o,
      })

export default detect
