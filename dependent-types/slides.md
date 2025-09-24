# Intro: Dependent Types

Dependent types are a dimension of the lambda cube.
Formally, dependent types let

> types **depend** on values

That all sounds really academic.
What does it even mean?

Less formally, dependent types are a powerful tool to
- eliminate assumptions about our data
- statically verify our program

## Goals

- Approachable for someone who's familiar with any kind of generic types
- Offer a different way of thinking about types

---

# Intro: Dependent Types

## Guaranteees we'd like from types

- Have we considered dividing by zero?
- If a list is not-empty, can we guarantee its reverse is also non-empty?
- Can we guarantee some function is commutative?
- Can we guarantee some function is monotone?

<!-- pause -->

## Assumptions are bad
 - break when you change the program
 - break when you merge
 - comments are non standardizable and easily go out of date

<!-- pause -->

We'll contrast progressively powerful type systems, mostly **using TypeScript**:

> C < C++ < Rust < Haskell < Tilly < Calculus of Constructions

We'll talk about more than just dependent types:
- **predicate types**

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

<!-- pause -->

- **Cons list**

Simple way of representing singly-linked lists.

We define the empty list ("Nil").
If we want to add an element to the list,
we "Cons" that data onto another list.

```haskell
friends = Nil
silksongBossesBeaten = Cons "Moss Mother" Nil
coworkers = Cons "Ceres" (Cons "Jane" (Cons "Anna" (Cons "Mishram" Nil)))
```

<!-- pause -->

- **Pattern matching**

```haskell
listLength list = case list of
  Nil -> Z
  Cons x xs -> S (listLength xs)
```

<!-- pause -->

- **Appending lists**

```haskell
appendLists listX listY = case listX of
  Nil -> listY
  Cons x xs -> Cons x (appendLists xs listY)
```

---

# In TypeScript

```ts
type Cons<T> = {
  kind: 'cons',
  data: T,
  next: List<T>,
}
type Nil = {
  kind: 'nil',
}
type List<T> = Cons<T> | Nil

const cons = <T,>(data: T, next: List<T>) => ({
  kind: 'cons', data, next,
})
const nil = { kind: 'nil' }

const coworkers: List<string> = cons('Ceres', cons('Jane', cons('Anna', cons('Mishram', nil))));
declare const coworkers: {
  kind: 'cons',
  data: 'Ceres',
  next: {
    kind: 'cons',
    data: 'Jane',
    next: {
      kind: 'cons',
      data: 'Anna',
      next: {
        kind: 'cons',
        data: 'Mishram',
        next: {
          kind: 'nil',
        },
      },
    },
  },
}
```

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

# Type-level computation

Generics types are _functions_, just at the type-level.
```typescript
type Id<T> = T
type DefaultArguments<T1, T2 = T1> = [T1, T2]
type ConstrainArguments<T extends string> = `${T}.${T}`
```

<!-- pause -->

**Caveat**: Generic value functions, are **quite different**.
If you're curious, this is _quantification_.
```typescript
function id<T>(value: T): T {
  return value
}
```

<!-- pause -->

TypeScript also offers pattern matching at the type-level:
```typescript
type Concat<TListX, TListY> = TListX extends { type: 'cons', head: infer Head, tail: infer Tail }
  ? { type: 'cons', head: Head, tail: Concat<Tail, TListY> }
  : ListY
```

---

# Higher Kinded Types

Since generic types are functions, we can translate over every concept related to functions.

<!-- pause -->

- **Composition**
```typescript
type Compose<F, G> = F<G</* uhm */>>
// type Compose<F, G> = T => F<G<T>>??
```

<!-- pause -->

**Oh wait**.
The arguments to our type-level functions can't be functions themselves.
Nor can we define lambdas.

<!-- pause -->

This is the same as the value-level concept of **first-class functions**.
Java until recently did not have first-class functions (Java still sucks).

- functions are regular values
- functions can be passed as arguments
- (often) functions can be defined as lambdas

<!-- pause -->

First-class functions at the type-level is known as **having Higher Kinded Types**.

**Very few** languages have Higher Kinded Types (HKT).
Haskell is one of them, and even it doesn't have HKT lambdas.

---

# HKT hacks

C doesn't have first class functions, but it _does_ have function pointers.

```c
int inc(int a) {
  return a + 1;
}
int *arr2 = map(&arr1, len, &inc)
```

<!-- pause -->

TypeScript is similar.
It may not have HKTs, but we can do something similar:

<!-- pause -->

```typescript
type Fns<TArg> = {
  tuplify: [TArg],
  array: Array<TArg>,
  nullish: TArg | null | undefined,
}
type Fn = keyof Fns<unknown>
type Apply<TFunction extends Fn, TArg> = Fns<TArg>[TFunction]

type MapTuple<TArr extends unknown[], TFn extends Fn> =
  TArr extends [infer Head, ...infer Tail]
    ? [Apply<TFn, Head>, ...MapTuple<Tail, TFn>]
    : []
```

If you want to read more, this is known as
_lightweight higher-kinded polymorphism_.

---

# Operators

In Haskell we have some computation operators.

```haskell
nEvens = length . filter even  -- \list -> length (filter even list)
x2 = f $ g $ a + b -- f (g (a + b))
```

We want these operators in the type level too.

<!-- pause -->

* Syntax
* Standard combinators
* Infix declarations

<!-- pause -->

**We're basically duplicating our language.**
Our type system computes just like our value system. So,

> What if types were values?

<!-- pause -->

Languages which work like this have **dependent types**:

* Lean
* Idris
* Agda

---

# Bonus: Quantification

Let's return briefly to quantification.

- In TypeScript and most mainstream languages, quantification only exists **syntactically** for functions

```typescript
function id<T>(value: T) {
  return value
}
```

- **Good** languages (Haskell) let us quantify _any type_
```haskell
id :: forall a. a -> a
id x = x
```

<!-- pause -->

Functions introduce quantification, but that's not where quantification stops.

```typescript
type Iso<T, U> = {
  to: (data: T) => U,
  from: (data: U) => T,
}
const isoNatArr: Iso<number, Array<undefined>> = {
  to: (length) => Array.from({ length }),
  from: (ar) => arr.length,
}
```

In Haskell:

```haskell
data Iso a b = Iso (a -> b) (b -> a)
isoNatList = Iso (\len -> replicate len ()) length
```

<!-- pause -->

But what about an identity `Iso`?

```haskell
isoId :: forall a. Iso a a
isoId = Iso id id
```
