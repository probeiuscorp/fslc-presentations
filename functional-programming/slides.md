---
author: Caleb Stimpson
---

# (Pure) Functional programming

This presentation will be all about functional programming, especially of the
pure variety.

We'll introduce Haskell and then show some applications in JavaScript/TypeScript.

## What we'll cover

* Haskell, algebraic data types, and monoids
* Monads
* Practical monads for impure languages

## Why understand (pure) functional programming?

* **Hardware is cheap, bugs are not.**

---

# Part 1: Haskell, Algebraic Data Types, and Monoids

---

# Part 2: Monads

> _"Monads are just a monoid in the category of endofunctors, what's the problem?"_

---

# Part 3: Practical monads

---

# Practical monads

*even for impure, imperative languages!*

## Our problem

Suppose you want to paint to a canvas, and repaint whenever some state changes.

```ts
let position = { x: 0, y: 0 }

function paintCanvas(ctx: CanvasRenderingContext2D) {
  ctx.fillRect(position.x, position.y, 20, 20)
}
```

## Our monads

Evidently,
* we'll have some impure code to paint on the canvas, and
* we'll need some state for `position`.

Let's put them in monads!

---

# I/O,  monad 1 of 2

In JavaScript, we can approximate an I/O type with `() => void`. It is less
powerful than a distinct I/O type because we can't distinguish it from pure
functions.

**However, it does what we need: separate pure from impure.** This
will make our lives much easier
* when modularizing our code, and
* when integrating with libraries like React.

## Let's make sure we have a monad

These are our `map` and `join` functions:
```ts
type IO<T> = () => T

function map<T, V>(io: IO<T>, transformContents: (data: T) => V): IO<V> {
  return () => transformContents(io())
}

function join<T>(nestedIO: IO<IO<T>>): IO<T> {
  return () => nestedIO()()
}
```

---

# State,  monad 2 of 2

`let` variables are a poor form of state. We can't observe when they change!

My favorite JavaScript library for state is `jotai`. _Atoms_ define relations
between data, and _Stores_ hold the actual data.

```ts
const store = createStore()
const positionAtom = atom({ x: 0, y: 0 })
store.get(positionAtom)  // "{ x: 0, y: 0 }"

const xPositionAtom = atom((get) => {
  const position = get(positionAtom)
  return position.x
});

store.sub(xPositionAtom, () => {
  console.log('x is now', store.get(xPositionAtom))
})
store.set(positionAtom, { x: 2, y: 2 })  // "x is now 2"
```

## Let's make sure we have a monad

These are our `map` and `join` functions:
```ts
function map<T, V>(anAtom: Atom<T>, transformContents: (data: T) => V): Atom<V> {
  return atom((get) => transformContents(get(anAtom)))
}

function join<T>(nestedAtom: Atom<Atom<T>>): Atom<T> {
  return atom((get) => get(get(nestedAtom)))
}
```
