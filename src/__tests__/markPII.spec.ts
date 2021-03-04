import { markPII, unwrap } from "../pii"

describe("markPII", () => {
  it("should not leak into toString", () => {
    const result = markPII("TEST_STRING")
    expect(result.toString()).not.toContain("TEST_STRING")
  })

  it("should not leak into JSON", () => {
    const result = markPII("TEST_STRING")
    expect(JSON.stringify(result)).not.toContain("TEST_STRING")
  })

  it("should not double mark", () => {
    const result = markPII(markPII("TEST_STRING"))
    expect(unwrap(result)).toBe("TEST_STRING")
  })
})
