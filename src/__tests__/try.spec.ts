import { PIITry, unwrap } from "../index"
import { identity } from "../result"

describe("PIITry", () => {
  it("should wrap results in PII", async () => {
    const result = await PIITry(() => "TEST_STRING")
    const success = result.fold(identity, () => void 0)
    expect(unwrap(success)).toBe("TEST_STRING")
  })

  it("should wrap exceptions in PII", async () => {
    const result = await PIITry<never, Error>(() => {
      throw new Error("Error message")
    })

    const errorMessage = result.fold(
      () => "never",
      e => unwrap(e).message,
    )

    expect(errorMessage).toBe("Error message")
  })
})
