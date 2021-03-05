import { PII, unwrap } from "../index"

describe("unwrap", () => {
  it("upwraps a value", () => {
    expect(unwrap(PII("test"))).toBe("test")
  })

  it("should map non PII as well", () => {
    expect(unwrap("test")).toBe("test")
  })
})
