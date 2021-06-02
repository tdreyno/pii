import { PII, tap, unwrap } from "../index"

describe("tap", () => {
  it("should tap inside PII", () => {
    const result = PII("TEST_STRING")
    let b: string | undefined = undefined
    const mapped = tap(a => (b = a), result)
    expect(unwrap(mapped)).toBe(b)
  })

  it("should tap non PII as well", () => {
    const result = "TEST_STRING"
    let b: string | undefined = undefined
    const mapped = tap(a => (b = a), result)
    expect(unwrap(mapped)).toBe(b)
  })
})
