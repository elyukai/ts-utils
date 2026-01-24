# General TypeScript Helpers

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
