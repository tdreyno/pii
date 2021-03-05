import { PII, test } from "../index"

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

  it("should also test predicate against non-PII", () => {
    const resultA = ["TEST_STRING"]
    const isItA = test(Array.isArray, resultA)
    expect(isItA).toBeTruthy()

    const resultB = "TEST_STRING"
    const isItB = test(a => a.includes("sprang"), resultB)
    expect(isItB).toBeFalsy()
  })
})
