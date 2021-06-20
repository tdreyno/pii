import { isPII } from "./pii"
import visit from "./visit"

const redact = (
  redactor: (data: any) => any,
  input: unknown,
  maxDepth = Infinity,
): unknown =>
  maxDepth === 0
    ? redactor(input)
    : visit(isPII(input) ? redactor(input) : input, {
        record: r =>
          Object.keys(r).reduce((sum, key) => {
            sum[key] = redact(redactor, r[key], maxDepth - 1)
            return sum
          }, {} as Record<string, unknown>),
        map: m =>
          new Map(
            Array.from(m).map(([k, v]) => [
              redact(redactor, k, maxDepth - 1),
              redact(redactor, v, maxDepth - 1),
            ]),
          ),
        array: a => a.map(x => redact(redactor, x, maxDepth - 1)),
        set: s =>
          new Set(Array.from(s).map(x => redact(redactor, x, maxDepth - 1))),
        primitive: p => p,
        object: o => o,
      })

export default redact
