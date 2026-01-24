# General TypeScript Helpers

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/elyukai/ts-utils/test.yml) ![NPM Version](https://img.shields.io/npm/v/%40elyukai%2Futils) [![JSR](https://jsr.io/badges/@elyukai/utils)](https://jsr.io/@elyukai/utils) [![JSR Score](https://jsr.io/badges/@elyukai/utils/score)](https://jsr.io/@elyukai/utils)

This package provides a range of utility functions that I personally often need, which is why I bundled them in a package.

```ts
import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"

const extractFirstNumberDoubled = (arr: number[]): number | undefined => {
  if (isNotEmpty(arr)) {
    return arr[0] * 2 // accessing index 0 is safe!
  }

  return undefined
}
```
