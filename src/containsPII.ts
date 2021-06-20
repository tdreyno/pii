import { isPII } from "./pii"
import visit from "./visit"

const containsPII = (input: unknown, maxDepth = Infinity): boolean => {
  if (maxDepth === 0 || isPII(input)) {
    return true
  }

  return visit(input, {
    record: o => Object.values(o).some(i => containsPII(i, maxDepth - 1)),
    map: m =>
      Array.from(m).some(
        ([k, v]) =>
          containsPII(k, maxDepth - 1) || containsPII(v, maxDepth - 1),
      ),
    array: a => a.some(i => containsPII(i, maxDepth - 1)),
    set: s => Array.from(s).some(i => containsPII(i, maxDepth - 1)),
    primitive: p => isPII(p),
    object: p => isPII(p),
  })
}

export default containsPII
