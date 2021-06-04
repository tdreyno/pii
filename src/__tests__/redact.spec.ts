import { PII, redact } from "../index"

const REDACTED = "REDACTED"
const redactor = () => REDACTED

describe("redact", () => {
  it("should redact all wrappers", () => {
    expect(redact(redactor, "test")).toBe("test")
    expect(redact(redactor, PII("test"))).toBe(REDACTED)

    expect(redact(redactor, 1)).toBe(1)
    expect(redact(redactor, PII(1))).toBe(REDACTED)

    expect(redact(redactor, null)).toBe(null)
    expect(redact(redactor, PII(null))).toBe(REDACTED)

    expect(redact(redactor, [])).toEqual([])
    expect(redact(redactor, PII([]))).toEqual(REDACTED)

    expect(redact(redactor, {})).toEqual({})
    expect(redact(redactor, PII({}))).toEqual(REDACTED)

    expect(redact(redactor, ["test"])).toEqual(["test"])
    expect(redact(redactor, PII(["test"]))).toEqual(REDACTED)

    expect(redact(redactor, { test: 1 })).toEqual({ test: 1 })
    expect(redact(redactor, PII({ test: 1 }))).toEqual(REDACTED)

    expect(redact(redactor, ["test", PII(2)])).toEqual(["test", REDACTED])
    expect(redact(redactor, PII(["test", PII(2)]))).toEqual(REDACTED)

    expect(redact(redactor, { test: 1, two: PII(2) })).toEqual({
      test: 1,
      two: REDACTED,
    })
    expect(redact(redactor, PII({ test: 1, two: PII(2) }))).toEqual(REDACTED)
  })

  it("should handle Map", () => {
    const map = new Map([["a", 1]])

    expect(redact(redactor, { test: map, two: PII(2) })).toEqual({
      test: map,
      two: REDACTED,
    })
  })

  it("should handle Set", () => {
    const set = new Set(["a", "b"])

    expect(redact(redactor, { test: set, two: PII(2) })).toEqual({
      test: set,
      two: REDACTED,
    })
  })

  it("should ignore weird Numbers", () => {
    const num = new Number(1)

    expect(redact(redactor, { test: num, two: PII(2) })).toEqual({
      test: num,
      two: REDACTED,
    })
  })
})
