/* eslint-disable @typescript-eslint/no-explicit-any */
import { detect, isPII } from "../index"

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
})
