import PII, { unwrap } from "../pii"

describe("PII", () => {
  it("should not leak into toString", () => {
    const result = PII("TEST_STRING")
    expect(result.toString()).not.toContain("TEST_STRING")
  })

  it("should not leak into JSON", () => {
    const result = PII("TEST_STRING")
    expect(JSON.stringify(result)).not.toContain("TEST_STRING")
  })

  it("should not double mark", () => {
    const result = PII(PII("TEST_STRING"))
    expect(unwrap(result)).toBe("TEST_STRING")
  })
})
