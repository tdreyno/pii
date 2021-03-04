import { markPII, fold, unwrap } from "../pii"

describe("fold", () => {
  it("should fold multiple PII", () => {
    const one = markPII(1)
    const two = markPII(2)
    const three = markPII(3)
    const folded = fold((sum, n) => sum + n, 0, [one, two, three])
    expect(unwrap(folded)).toBe(6)
  })
})
