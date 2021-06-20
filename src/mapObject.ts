import visit from "./visit"
import mapRecord from "./mapRecord"
import mapMap from "./mapMap"
import mapSet from "./mapSet"

export default <U extends any>(
  mapper: (v: unknown) => U,
  input: unknown,
): unknown =>
  visit(input, {
    record: mapRecord(mapper),
    map: mapMap(mapper),
    array: a => a.map(mapper),
    set: mapSet(mapper),
    primitive: p => p,
    object: o => o,
  })
