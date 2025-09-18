# Dependent Types

Dependent types are a dimension of the lambda cube.

---

# Computation prereqs

- **Natural numbers**

We define zero ("Z").
Apply "S" to any natural to get the next.

```haskell
nFlyingPigs = Z
nEarths = S Z
nSidesOfHexagon = S (S (S (S (S (S Z)))))
```

- **Cons list**

Simple way of representing singly-linked lists.

We define the zero element list ("Nil").
If we want to add an element to the list,
we "Cons" that data onto another list.

```haskell
friends = Nil
silksongBossesBeaten = Cons "Moss Mother" Nil
coworkers = Cons "Ceres" (Cons "Jane" (Cons "Anna" (Cons "Mishram" Nil)))
```

- **Pattern matching**

```haskell
listLength list = case list of
  Nil -> Z
  Cons x xs -> S (listLength xs)
```

- **Appending lists**

```haskell
appendLists listX listY = case listX of
  Nil -> listY
  Cons x xs -> Cons x (appendLists xs listY)
```

---

# TypeScript values

---

# TypeScript types

Types for JavaScript.
Type syntax is similar to the Java/C++ family.

An array of numbers:
```typescript
const xs: Array<number> = []
```

In this presentation we'll never actually care about the value of any definition.
We can specify just the type using `declare`:
```typescript
declare const xs: Array<number>
```

---

# TypeScript introduction

# Higher Kinded Types

```typescript
type Fns<TArg> = {
  tuplify: [TArg],
}
type Fn = keyof Fns<unknown>
type Apply<TFunction extends Fn, TArg> = Fns<TArg>[TFunction]
```

# Functions in types

# Computation
