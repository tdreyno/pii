import PII from "../pii"
import containsPII from "../containsPII"

describe("containsPII", () => {
  it("should not find PII", () => {
    expect(containsPII("test")).toBeFalsy()
    expect(containsPII(1)).toBeFalsy()
    expect(containsPII(null)).toBeFalsy()
    expect(containsPII([])).toBeFalsy()
    expect(containsPII({})).toBeFalsy()
    expect(containsPII(["test"])).toBeFalsy()
    expect(containsPII({ test: 1 })).toBeFalsy()
  })

  it("should find PII", () => {
    expect(containsPII(PII("test"))).toBeTruthy()
    expect(containsPII(PII(1))).toBeTruthy()
    expect(containsPII(PII(null))).toBeTruthy()
    expect(containsPII(PII([]))).toBeTruthy()
    expect(containsPII(PII({}))).toBeTruthy()
    expect(containsPII([PII("test")])).toBeTruthy()
    expect(containsPII({ test: PII(1) })).toBeTruthy()
  })

  it("should return true after max depth", () => {
    expect(containsPII({ test: [{ hello: "world" }] }, 2)).toBeTruthy()
  })
})
