import PII, { test } from "../index"

describe("test", () => {
  it("should test predicate against PII", () => {
    const result = PII(["TEST_STRING"])
    const isIt = test(Array.isArray, result)
    expect(isIt).toBeTruthy()
  })

  it("should test predicate against PII", () => {
    const result = PII("TEST_STRING")
    const isIt = test(a => a.includes("sprang"), result)
    expect(isIt).toBeFalsy()
  })
})
