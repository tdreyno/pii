import PIITry from "../PIITry"
import unwrap from "../unwrap"

describe("PIITry", () => {
  it("should wrap results in PII", async () => {
    const result = await PIITry(() => "TEST_STRING")
    expect(result).toBe("TEST_STRING")
  })

  it("should wrap exceptions in PII", async () => {
    try {
      await PIITry(() => {
        throw new Error("Error message")
      })
    } catch (e) {
      expect(unwrap(e).message).toBe("Error message")
    }
  })
})
