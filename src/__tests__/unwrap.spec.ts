import PII, { unwrap } from "../pii"

describe("unwrap", () => {
  it("upwraps a value", () => {
    expect(unwrap(PII("test"))).toBe("test")
  })
})
