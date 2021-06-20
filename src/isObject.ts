// Function, regex, object, Number, String, etc
export default (value: unknown): boolean => {
  const type = typeof value
  return value != null && (type == "object" || type == "function")
}
