---
author: Caleb Stimpson
---

# (Pure) Functional programming

This presentation will be all about functional programming, especially of the
pure variety.

## What we'll cover

* Monads in theory: a light introduction in modern JavaScript/TypeScript
* Applied monads: live-coding session of using monads to solve problems

## Why understand (pure) functional programming?

* **Hardware is cheap, bugs are not.**

---

# Part 1: Monads

> _"Monads are just a monoid in the category of endofunctors, what's the problem?"_

---

# Not repeating yourself

Consider we have an array:
```ts
const friends = ['Jane', 'Janice', 'Janet', 'Jay', 'Justice']
```

We got this data from the database, and would now like to show it to our user.
The problem is, we only have an array of friends, not an array of UI!

Fortunately, we do have a function which takes a friend and gives us some UI.

```tsx
function uiFromFriend(friendName: string): UI {
  return (
    <div>
      {friendName}
      <button>
        Unfriend?
      </button>
    </div>
  )
}
```

If you were programming this in 2013, maybe the code would have looked a bit
like this:
```tsx
var friendsUI = []
for (var i = 0; i < friends.length; i++) {
  friendsUI.push(uiFromFriend(friends[i]))
}
```

In 2015 however, we got a lot of new toys. Nowadays, you'd write something like
this:

```tsx
const friendsUI = friends.map(uiFromFriend)
```

---

# The magic of `.map`

What do we like more about the `.map` snippet than the `for`–`.push` snippet?
* It is much shorter. Shorter code has less to mess up and less to remember.
* We didn't have to deal with the "details" of Array. We called `.map`, and it took care of the looping.
* If we decided to use a different data structure, like Iterator or AsyncIterator, hopefully they'd also provide a `.map`.
* **No statements.** Because `.map` is an expression, we could inline it into some other UI without having to define it beforehand.

Most of all, I'd like to highlight that `.map` is not a syntax feature. We could've defined it ourself.

## Refresher

Given
```tsx
function uiFromFriend(friendName: string): UI {
  return (
    <div>
      {friendName}
      <button>
        Unfriend?
      </button>
    </div>
  )
}
```

`for`–`.push` way
```tsx
var friendsUI = []
for (var i = 0; i < friends.length; i++) {
  friendsUI.push(uiFromFriend(friends[i]))
}
```

`.map` way
```tsx
const friendsUI = friends.map(uiFromFriend)
```

---

# Heading pending

Suppose our friend was still being fetched from the backend. We might represent
it as a `Promise`.

```ts
const pendingFriend = new Promise<string>(/* fetch from somewhere... */)
```

Loading states are common enough that the library we use accepts both `UI` and `Promise<UI>`:

```ts
import { render } from 'my-library'

const myUI = new Promise<UI>((resolve) => {
  pendingFriend.then((friend) => {
    const ui = uiFromFriend(friend)
    resolve(ui)
  })
})
render(myUI)
```

However, we then read up a bit on the documentation for `.then`, and learn it
actually has a return value. Capitalizing on this knowledge, we shorten our code
dramatically:

```ts
const myUI = pendingFriend.then(uiFromFriend)
render(myUI)
```

## Refresher

```tsx
function uiFromFriend(friendName: string): UI {
  return (
    <div>
      {friendName}
      <button>
        Unfriend?
      </button>
    </div>
  )
}
```

---

# Generalizing

Array `.map` and Promise `.then` have suspisciously similar types:

```ts
declare function arrayMap   <T, V>(this: Array<T>,   transformContents: (data: T) => V): Array<V>
declare function promiseThen<T, V>(this: Promise<T>, transformContents: (data: T) => V): Promise<V>
```

(note that these types have been _mildly_ simplified)

This pattern is important enough that it has a name: both Array and Promise are
a _functor_.

## What is a functor?

Fundamentally, a functor is any structure for which you can implement a function
like this:

```ts
type SomeFunctor<T> = /* your structure */
declare function mapSomeFunctor<T, V>(structure: SomeFunctor<T>, transformContents: (data: T) => V): SomeFunctor<V>
```

Let's take a look at another functor: `Maybe`. `Maybe` is one solution out of
the many solutions that exist for _null_.

---

# Maybe

In JavaScript, `Maybe` could be implemented like so:
```ts
type Some<T>  = { type: 'some', data: T }
type None     = { type: 'none' }
type Maybe<T> = Some<T> | None

// Some useful constructurs
const some = (data: T): Some<T> => ({ type: 'some', data })
const none: None = { type: 'none' }

// Converting from null and undefined
function fromNullish<T>(nullish: T | null | undefined): Maybe<T> {
  if(nullish === null || nullish === undefined) return none
  return some(nullish)
}
function orNull<T>(maybe: Maybe<T>): T | null {
  if(maybe.type === 'none') return null
  return maybe.data
}

// Example usage
function getFirstElementOfArray<T>(array: T[]): Maybe<T> {
  if(array.length === 0) return none
  return some(array[0])
}
```

At this time however, our `Maybe` is only better than `undefined` in that it can nest other `Maybe`'s.

By nesting, I mean that `getFirstElementOfArray` will:
* return `none` for an empty array
* return `some(undefined)` for an array with only one element, undefined

We would not be able to distinguish those cases if we used `undefined`. We'll
see later that this is unexpectedly important.

---

# Making Maybe more useful

Let's make our `Maybe` a functor by implementing a `map` function, which is
known as its _functor instance_.

```ts
// Maybe's functor instance
function mapMaybe<T, V>(maybe: Maybe<T>, transformContents: (data: T) => V): Maybe<V> {
  if(maybe.type === 'none') {
    return maybe
  } else {
    return some(transformContents(maybe.data))
  }
}
```

## Limitations of functors

Suppose we had a 2D array:
```ts
const exponentSeries = [[1, 2, 4, 8], [1, 3, 9, 27], [1, 4, 16, 64]]
```

We would like to safely try to get the first cell:
```ts
const maybe2sSeries: Maybe<number[]> = getFirstElementOfArray(exponentSeries)
const maybeFirstCell: Maybe<Maybe<number[]>> = mapMaybe(maybe2sSeries, getFirstElementOfArray)
```

Oh no! We're _mostly_ there but `maybeFirstCell` is of type `Maybe<Maybe<...>>`,
which is not really what we want. Importantly though, the information is there;
we just want to lose some of it.

Because we're lazy, let's just make a helper function to flatten those nested
`Maybe`'s.

```ts
function joinMaybe(nestedMaybe: Maybe<Maybe<T>>): Maybe<T> {
  if(nestedMaybe.type === 'none') {
    return nestedMaybe
  } else {
    return nestedMaybe.data
  }
}
```

We've just made a _monad_.

---

# Monads

For a functor to also be a monad, we need a function which looks like this:

```ts
type SomeMonad<T> = /* your structure */
declare function join(nestedStructures: SomeMonad<SomeMonad<T>>): SomeMonad<T>
```

Let's make a monad instance for our friend `Array`.

```ts
function joinArrays<T>(nestedArray: Array<Array<T>>): Array<T> {
  const allElements: Array<T> = []
  for(const innerArray of nestedArray) {
    for(const cell of innerArray) {
      allElements.push(cell)
    }
  }
  return allElements
}
```

Here we join by simply concatenating all the inner arrays.

## flatMap

Calling `join` right after `map`'ing is so common that it is usually provided,
no derivation necessary. Such is the case with the ES6 array:
* `.map` is of course our functor instance,
* `.flat` is our join, and
* `.flatMap` is provided to save us some key strokes.

Notably, Array `.flatMap` is exceptionally useful for filtering lists.
```tsx
const friends = [{ name: 'Jane', favorite: true }, { name: 'Janet', favorite: false }]
const ui = friends.flatMap(({ name, favorite }) => {
  if(!favorite) return []
  return [uiFromFriend(name)]
})
```

---

# Part 2: Applied monads

_How monads can help you solve problems practically, even in impure languages._

---

# Applying monads

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
