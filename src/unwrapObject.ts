import { isPII } from "./pii"
import visit from "./visit"
import unwrap from "./unwrap"

const unwrapObject = (input: unknown, maxDepth = Infinity): unknown =>
  maxDepth === 0
    ? null
    : visit(isPII(input) ? unwrap(input) : input, {
        record: r =>
          Object.keys(r).reduce((sum, key) => {
            sum[key] = unwrapObject(r[key], maxDepth - 1)
            return sum
          }, {} as Record<string, unknown>),
        map: m =>
          new Map(
            Array.from(m).map(([k, v]) => [
              unwrapObject(k, maxDepth - 1),
              unwrapObject(v, maxDepth - 1),
            ]),
          ),
        array: a => a.map(i => unwrapObject(i, maxDepth - 1)),
        set: s =>
          new Set(Array.from(s).map(i => unwrapObject(i, maxDepth - 1))),
        primitive: p => p,
        object: o => o,
      })

export default unwrapObject
