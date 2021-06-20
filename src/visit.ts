import isRecord from "./isRecord"
import isObject from "./isObject"

export default <A, T>(
  input: A,
  visitors: {
    record: (value: Record<string, unknown>) => T
    map: (value: Map<unknown, unknown>) => T
    set: (value: Set<unknown>) => T
    object: (value: unknown) => T
    array: (value: Array<unknown>) => T
    primitive: (value: A) => T
  },
): T => {
  if (isRecord(input)) {
    return visitors.record(input)
  }

  if (Array.isArray(input)) {
    return visitors.array(input)
  }

  if (input instanceof Map) {
    return visitors.map(input)
  }

  if (input instanceof Set) {
    return visitors.set(input)
  }

  if (isObject(input)) {
    return visitors.object(input)
  }

  return visitors.primitive(input)
}
