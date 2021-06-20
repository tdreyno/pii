import PII from "../pii"
import unwrap from "../unwrap"

describe("unwrap", () => {
  it("upwraps a value", () => {
    expect(unwrap(PII("test"))).toBe("test")
  })

  it("should map non PII as well", () => {
    expect(unwrap("test")).toBe("test")
  })
})
