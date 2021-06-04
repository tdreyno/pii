# pii

[![Test Coverage](https://api.codeclimate.com/v1/badges/1c788782dac545f74307/test_coverage)](https://codeclimate.com/github/tdreyno/pii/test_coverage)
[![npm latest version](https://img.shields.io/npm/v/@tdreyno/pii/latest.svg)](https://www.npmjs.com/package/@tdreyno/pii)
[![Minified Size](https://badgen.net/bundlephobia/minzip/@tdreyno/pii)](https://bundlephobia.com/result?p=@tdreyno/pii)

pii is library for wrapping Personally Identifying Information and providing ways to limit its spread.

## Installation

### Yarn

```sh
yarn add @tdreyno/pii
```

### NPM

```sh
npm install --save @tdreyno/pii
```

## Usage

The concept is simple. Wrap `PII` around any PII data **as soon as it enters your system.**

```typescript
import { PII, unwrapObject } from "@tdreyno/pii"

const handlePost = (postBody: { name: string; phoneNumber: string }) =>
  createUser(PII(postBody.name), PII(postBody.phoneNumber))

const createUser = (name: PII<string>, phoneNumber: PII<string>) =>
  sendToThirdParty(unwrapObject({ name, phoneNumber }))
```

`PII` wraps any data and obscures the details. Attempts to coerce it to other types or convert to JSON will result in a string result of `PII<REDACTED>`. Once the PII has flowed through your system, use `unwrap` to get the data back out for posting to a third party. Or `unwrapObject` which will recursively unwrap PII inside a post body object.

### Avoiding unsafe unwrapping and rewrapping

If you want to combine two pieces of PII, such as first and last name, you might want to unwrap, combine and then rewrap them. Once you start using unwrap everywhere, it becomes very hard to maintain safetly. Rather, use the built in methods of this library to mutate and combine PII while keeping the data inside the wrapper.

#### Modify PII

```typescript
import { PII, map } from "@tdreyno/pii"

const name = PII("Thomas")
const lowercaseName = map(n => n.toLowerCase(), name) // PII<"thomas">
```

#### Combine two things

```typescript
import { PII, zip2With } from "@tdreyno/pii"

const firstName = PII("Thomas")
const lastName = PII("Reynolds")
const fullName = zip2With(
  (first, last) => `${first} ${last}`,
  firstName,
  lastName,
) // PII<Thomas Reynolds>
```

**Note:** There are methods for up to 4 PII inputs: `zip2With`, `zip3With`, `zip4With`.

#### Reduce a list of PII

```typescript
import { PII, fold } from "@tdreyno/pii"

const address1 = PII(ADDRESS_OBJECT_1)
const address2 = PII(ADDRESS_OBJECT_2)
const address2 = PII(ADDRESS_OBJECT_2)

const allAddresses = fold(
  (acc, address) => (acc.push(address), acc),
  [],
  [address1, address2, address3],
) // PII<[address1, address2, address3]>
```

#### Inspect or create side-effects using PII contents without unwrapping

```typescript
import { PII, tap } from "@tdreyno/pii"

const name = PII("Thomas")
const lowercaseName = tap(n => console.log(n), name) // Logs "Thomas"
```

#### Custom PII Redaction

```typescript
import { PII, redact } from "@tdreyno/pii"

const name = PII("Thomas")
const lowercaseName = redact(() => "REDACTED", name) // Returns "REDACTED"
```

## License

pii is licensed under the Hippocratic License. It is an [Ethical Source license](https://ethicalsource.dev) derived from the MIT License, amended to limit the impact of the unethical use of open source software.
