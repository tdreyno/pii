import PII from "../pii"
import zip2With from "../zip2With"
import zip3With from "../zip3With"
import zip4With from "../zip4With"
import unwrap from "../unwrap"

describe("zipWith", () => {
  it("should zipWith two different types of PII", () => {
    const name = PII("three")
    const three = PII(3)
    const zipped = zip2With((a, b) => `${a} ${b}`, name, three)
    expect(unwrap(zipped)).toBe("three 3")
  })

  it("should zipWith two mixed types of PII", () => {
    const name = PII("three")
    const three = 3
    const zipped = zip2With((a, b) => `${a} ${b}`, name, three)
    expect(unwrap(zipped)).toBe("three 3")
  })

  it("should zipWith three different types of PII", () => {
    const name = PII("three")
    const three = PII(3)
    const nope = PII(false)
    const zipped = zip3With(
      (a, b, c) => `${a} ${b} ${c ? "true" : "false"}`,
      name,
      three,
      nope,
    )
    expect(unwrap(zipped)).toBe("three 3 false")
  })

  it("should zipWith three mixed types of PII", () => {
    const name = PII("three")
    const three = PII(3)
    const nope = false
    const zipped = zip3With(
      (a, b, c) => `${a} ${b} ${c ? "true" : "false"}`,
      name,
      three,
      nope,
    )
    expect(unwrap(zipped)).toBe("three 3 false")
  })

  it("should zipWith four different types of PII", () => {
    const name = PII("three")
    const three = PII(3)
    const nope = PII(false)
    const who = PII("six")
    const zipped = zip4With(
      (a, b, c, d) => `${a} ${b} ${c ? "true" : "false"} ${d}`,
      name,
      three,
      nope,
      who,
    )
    expect(unwrap(zipped)).toBe("three 3 false six")
  })

  it("should zipWith four mixed types of PII", () => {
    const name = PII("three")
    const three = PII(3)
    const nope = PII(false)
    const who = "six"
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
