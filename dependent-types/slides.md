# Intro: Dependent Types

Dependent types are a dimension of the Lambda Cube.
Formally, dependent types let

> types **depend** on values

**That all sounds really academic.**
What does it even mean?

Less formally, dependent types are a powerful tool to
- statically verify our program
- eliminate assumptions about our data

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
- Has this kind of AST node already been handled?

<!-- pause -->

## Assumptions are bad
 - break when you change the program
 - break when you merge
 - comments are non standardizable and easily go out of date

<!-- pause -->

We'll contrast progressively powerful type systems, mostly **using TypeScript**:

> C < C++ < Rust < Haskell < Tilly < Calculus of Constructions

We'll talk about more than just dependent types:
- **refinement types**
- **quantification**

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

listLength friends == Z -- 0
listLength coworkers == S (S (S (S Z))) -- 4
```

<!-- pause -->

- **Appending lists**

```haskell
appendLists listX listY = case listX of
  Nil -> listY
  Cons x xs -> Cons x (appendLists xs listY)
```

---

# Types prereqs

A type is a set of possible values.
It lets us safely assume what a value can be.
```typescript
declare const x: number

type Player = {
  name: string
  rating: number
}
```

<!-- pause -->

When we have a repetitive type, we use generics to have One Source of Truth.
```typescript
type Pair<T> = {
  first: T
  second: T
}
```

<!-- pause -->

Types of just one value are also possible and useful.
```typescript
type Cons<T> = {
  kind: 'cons'
  data: T
  tail: List<T>
}
type Nil = {
  kind: 'nil'
}
type List<T> = Cons<T> | Nil
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
type Concat<TListX, TListY> = TListX extends { kind: 'cons', head: infer Head, tail: infer Tail }
  ? { kind: 'cons', head: Head, tail: Concat<Tail, TListY> }
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

Supporting this is the same as the value-level concept of **first-class functions**.
Java until recently did not have first-class functions (Java still sucks).

- functions are values like any other
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
int *arr2 = map(&arr1, len, &inc);
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
type Apply<TFn extends Fn, TArg> = Fns<TArg>[TFn]
type NumberArray = Apply<'array', number>
```

<!-- pause -->

```typescript
type MapTuple<TArr extends unknown[], TFn extends Fn> =
  TArr extends { kind: 'cons', data: infer Head, tail: infer Tail }
    ? { kind: 'cons', data: Head, tail: MapTuple<Tail, TFn> }
    : { kind: 'nil' }
```

If you want to read more, this is known as
_lightweight higher-kinded polymorphism_.

---

# Operators

In Haskell we have some computation operators.

```haskell
nEvens = length . filter even  -- \list -> length (filter even list)
nLines = length $ lines $ lookup contents request  -- length (lines (lookup contents request))
```

We want these operators in the type level too.

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

Read more: https://lean-lang.org/functional_programming_in_lean/Programming-with-Dependent-Types/

---

# Dependent types: Examples

See these examples in the Lean docs:
 - [natOrStringThree](https://lean-lang.org/functional_programming_in_lean/Programming-with-Dependent-Types/)
 - OfNat
 - [GetElem](https://lean-lang.org/functional_programming_in_lean/Overloading-and-Type-Classes/Arrays-and-Indexing/#NonEmptyList)

<!-- pause -->

## Trouble in paradise

Dependent types have a few awkward spots:
- Values and types share the same namespace
- If Types are values, which then must have types, what type do values of type Type have? **Type 1**.

---

# Bonus: Refinement types

Distinct from the Lambda Cube is refinement types.
They let us express constraints such as:
* Zero must be handled before dividing
* Some list must not be empty
* Some function must be monotone
* Some function must be commutative

**Liquid Haskell** is the foremost implementation of refinement types.

<!-- pause -->

## Trouble in paradise

What's the boundary between **structural** and **predicate**?

I'm biased here. I'm working on a language Tilly which tries to solve these problems using structure.

```haskell
twoElementList :: Cons 1 (Cons 2 Nil)
atLeastTwoElementList :: Cons 1 (Cons 2 (List Nat))
```

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
  from: (arr) => arr.length,
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
