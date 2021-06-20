import isRecord from "./isRecord"

// Class which wraps PII and keeps logging from accessing it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PII<T> {
  toString: () => string
  toJSON: () => string
}

export const isPII = <T>(val: unknown): val is PII<T> =>
  isRecord(val) && val.__brand === "PII"

const PII = <T>(val: T, msg = "REDACTED"): PII<T> =>
  isPII<T>(val)
    ? val
    : ({
        __brand: "PII",
        __fire_me_if_you_see_me_accessing_this_property_outside_pii_ts: val,
        toString: () => `PII<${msg}>`,
        toJSON: () => `PII<${msg}>`,
      } as PII<T>)

export default PII
