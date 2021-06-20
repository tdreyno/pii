import { isPII } from "../pii"
import detect from "../detect"
import unwrap from "../unwrap"

const detector = (data: unknown) => Array.isArray(data)

describe("detect", () => {
  it("should detect variables", () => {
    expect(detect(detector, "test")).toBe("test")
    expect(isPII(detect(detector, []))).toBeTruthy()
  })

  it("should handle Map", () => {
    const map = new Map<string, any>([
      ["a", 1],
      ["b", []],
    ])

    const detectedArrays = detect(detector, { test: map })
    expect(isPII((detectedArrays as any).test.get("b"))).toBeTruthy()
  })

  it("should handle Set", () => {
    const set = new Set([[]])

    const detectedArrays = detect(detector, { test: set })
    expect(isPII(Array.from((detectedArrays as any).test)[0])).toBeTruthy()
  })

  it("should return PII after max depth", () => {
    const result: any = detect(() => false, { test: [{ hello: "world" }] }, 2)

    expect(unwrap(result.test[0])).toEqual({ hello: "world" })
  })
})
