import PII, { isPII } from "./pii"

function unwrap<T>(item: PII<T>): Exclude<T, PII<any>>
function unwrap<T>(item: T): Exclude<T, PII<any>>
function unwrap<T>(item: T | PII<T>): Exclude<T, PII<any>> {
  return isPII(item)
    ? (item as any)[
        "__fire_me_if_you_see_me_accessing_this_property_outside_pii_ts"
      ]
    : item
}

export default unwrap
