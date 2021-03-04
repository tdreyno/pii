import { markPII, map, unwrap } from "../pii"

describe("map", () => {
  it("should map inside PII", () => {
    const result = markPII("TEST_STRING")
    const mapped = map(a => a.toLowerCase(), result)
    expect(unwrap(mapped)).toBe("test_string")
  })
})
