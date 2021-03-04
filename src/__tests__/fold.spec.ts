import PII, { fold, unwrap } from "../pii"

describe("fold", () => {
  it("should fold multiple PII", () => {
    const one = PII(1)
    const two = PII(2)
    const three = PII(3)
    const folded = fold((sum, n) => sum + n, 0, [one, two, three])
    expect(unwrap(folded)).toBe(6)
  })
})
