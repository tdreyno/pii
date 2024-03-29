import PII from "../pii"
import fold from "../fold"
import unwrap from "../unwrap"

describe("fold", () => {
  it("should fold multiple PII", () => {
    const one = PII(1)
    const two = PII(2)
    const three = PII(3)
    const folded = fold((sum, n) => sum + n, 0, [one, two, three])
    expect(unwrap(folded)).toBe(6)
  })

  it("should fold mixed PII", () => {
    const one = PII(1)
    const two = 2
    const three = PII(3)
    const folded = fold((sum, n) => sum + n, 0, [one, two, three])
    expect(unwrap(folded)).toBe(6)
  })
})
