import { PII, unwrap } from "../index"

describe("unwrap", () => {
  it("upwraps a value", () => {
    expect(unwrap(PII("test"))).toBe("test")
  })
})
