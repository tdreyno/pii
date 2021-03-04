import { markPII, zip2With, zip3With, zip4With, unwrap } from "../pii"

describe("zipWith", () => {
  it("should zipWith two different types of PII", () => {
    const name = markPII("three")
    const three = markPII(3)
    const zipped = zip2With((a, b) => `${a} ${b}`, name, three)
    expect(unwrap(zipped)).toBe("three 3")
  })

  it("should zipWith three different types of PII", () => {
    const name = markPII("three")
    const three = markPII(3)
    const nope = markPII(false)
    const zipped = zip3With(
      (a, b, c) => `${a} ${b} ${c ? "true" : "false"}`,
      name,
      three,
      nope,
    )
    expect(unwrap(zipped)).toBe("three 3 false")
  })

  it("should zipWith four different types of PII", () => {
    const name = markPII("three")
    const three = markPII(3)
    const nope = markPII(false)
    const who = markPII("six")
    const zipped = zip4With(
      (a, b, c, d) => `${a} ${b} ${c ? "true" : "false"} ${d}`,
      name,
      three,
      nope,
      who,
    )
    expect(unwrap(zipped)).toBe("three 3 false six")
  })
})
