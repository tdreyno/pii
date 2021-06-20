import { isPII } from "./pii"
import visit from "./visit"

const containsPII = (input: unknown, maxDepth = Infinity): boolean => {
  if (maxDepth === 0 || isPII(input)) {
    return true
  }

  const fn = (v: any) => containsPII(v, maxDepth - 1)

  return visit(input, {
    record: r => Object.values(r).some(fn),
    map: m => Array.from(m).some(([k, v]) => fn(k) || fn(v)),
    array: a => a.some(fn),
    set: s => Array.from(s).some(fn),
    primitive: p => isPII(p),
    object: p => isPII(p),
  })
}

export default containsPII
