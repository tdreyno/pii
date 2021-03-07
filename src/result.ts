import { PII } from "./pii"

export const identity = <X>(x: X): X => x

export class Ok<S, E> {
  constructor(private value: S) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fold<R>(ok: (value: S) => R, _err: (err: E) => R): R {
    return ok(this.value)
  }
}

export class Err<E, S> {
  constructor(private err: E) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fold<R>(_ok: (value: S) => R, err: (err: E) => R): R {
    return err(this.err)
  }
}

export type Result<S, E> = Ok<S, E> | Err<E, S>

export async function PIITry<S, E extends Error>(
  fn: () => S | Promise<S>,
): Promise<Result<PII<S>, PII<E>>> {
  try {
    return new Ok(PII(await fn()))
  } catch (e) {
    return new Err(PII(e))
  }
}
