import PII from "./pii"

export default async function PIITry<S>(fn: () => S | Promise<S>): Promise<S> {
  try {
    return fn()
  } catch (e) {
    throw PII(e, "REDACTED_ERROR")
  }
}
