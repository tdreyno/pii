import { PII, map, unwrap } from "../index"

describe("map", () => {
  it("should map inside PII", () => {
    const result = PII("TEST_STRING")
    const mapped = map(a => a.toLowerCase(), result)
    expect(unwrap(mapped)).toBe("test_string")
  })

  it("should map non PII as well", () => {
    const result = "TEST_STRING"
    const mapped = map(a => a.toLowerCase(), result)
    expect(unwrap(mapped)).toBe("test_string")
  })
})
