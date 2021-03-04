import PII, { unwrapObject } from "../pii"

describe("unwrapObject", () => {
  it("should remove all wrappers", () => {
    expect(unwrapObject("test")).toBe("test")
    expect(unwrapObject(PII("test"))).toBe("test")

    expect(unwrapObject(1)).toBe(1)
    expect(unwrapObject(PII(1))).toBe(1)

    expect(unwrapObject(null)).toBe(null)
    expect(unwrapObject(PII(null))).toBe(null)

    expect(unwrapObject([])).toEqual([])
    expect(unwrapObject(PII([]))).toEqual([])

    expect(unwrapObject({})).toEqual({})
    expect(unwrapObject(PII({}))).toEqual({})

    expect(unwrapObject(["test"])).toEqual(["test"])
    expect(unwrapObject(PII(["test"]))).toEqual(["test"])

    expect(unwrapObject({ test: 1 })).toEqual({ test: 1 })
    expect(unwrapObject(PII({ test: 1 }))).toEqual({ test: 1 })

    expect(unwrapObject(["test", PII(2)])).toEqual(["test", 2])
    expect(unwrapObject(PII(["test", PII(2)]))).toEqual(["test", 2])

    expect(unwrapObject({ test: 1, two: PII(2) })).toEqual({ test: 1, two: 2 })
    expect(unwrapObject(PII({ test: 1, two: PII(2) }))).toEqual({
      test: 1,
      two: 2,
    })
  })
})
