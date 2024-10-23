---
author: Caleb Stimpson
---

# (Pure) Functional programming

This presentation will be all about functional programming, especially of the
pure variety.

## What we'll cover

* First half (70m)
  * Monads in theory: a light introduction in modern JavaScript/TypeScript
  * Applied monads: live-coding session of using monads to solve problems
  * Haskell: brief journey through the highlights of Haskell
* Second half (40m)
  * Recursive data types & Monoids
  * Lambda calculus

## Knowledge we will be building off of

We'll spend most of the presentation using JavaScript/TypeScript, notably making
extensive use of anonymous functions. Hopefully you have some familiarity with
these tools, but if you don't, questions are always welcome.

## Why understand (pure) functional programming?

* **Hardware is cheap, bugs are not.**
* (More) purity can help you keep your code from becoming spaghetti; so
* (More) purity speeds up development, iteration, improvement and expansion.
* (More) purity is a very effective heuristic. When two solutions seem the same, the purer solution is a good call.

### Source

The source of this presentation is on GitHub, at https://github.com/probeiuscorp/fslc-presentations.

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
declare function arrayMap   <T, U>(this: Array<T>,   transformContents: (data: T) => U): Array<U>
declare function promiseThen<T, U>(this: Promise<T>, transformContents: (data: T) => U): Promise<U>
```

This pattern is important enough that it has a name: Array and Promise are both
a _functor_.

## What is a functor?

Fundamentally, a functor is any structure for which you can implement a function
like this:

```ts
type SomeFunctor<T> = /* your structure */
declare function mapSomeFunctor<T, U>(structure: SomeFunctor<T>, transformContents: (data: T) => U): SomeFunctor<U>
```

---

# Maybe

We'll leave Array and Promise behind for now, and take a look at Maybe, one
solution out of the many that exist for nullability.

In JavaScript, `Maybe` could be implemented like so:
```ts
type Just<T>  = { type: 'just', data: T }
type Nothing  = { type: 'nothing' }
type Maybe<T> = Just<T> | Nothing

// Some useful constructurs
const just = (data: T): Just<T> => ({ type: 'just', data })
const nothing: Nothing = { type: 'nothing' }

// Converting from null and undefined
function fromNullish<T>(nullish: T | null | undefined): Maybe<T> {
  if(nullish === null || nullish === undefined) return nothing
  return just(nullish)
}
function orNull<T>(maybe: Maybe<T>): T | null {
  if(maybe.type === 'nothing') return null
  return maybe.data
}

// Example usage
function getFirstElementOfArray<T>(array: T[]): Maybe<T> {
  if(array.length === 0) return nothing
  return just(array[0])
}
```

At this time however, our `Maybe` is only better than `undefined` in that it can nest other `Maybe`'s.

By nesting, I mean that `getFirstElementOfArray` will:
* return `nothing` for an empty array
* return `just(undefined)` for an array with only one element, undefined

We would not be able to distinguish those cases if we used `undefined`. We'll
see later that this is unexpectedly important.

---

# Making Maybe more useful

Let's make our `Maybe` a functor by implementing a `map` function, which is
known as its _functor instance_.

```ts
// Maybe's functor instance
function mapMaybe<T, U>(maybe: Maybe<T>, transformContents: (data: T) => U): Maybe<U> {
  if(maybe.type === 'nothing') {
    return maybe
  } else {
    return just(transformContents(maybe.data))
  }
}
```

## Limitations of functors

Suppose we had a 2D array:
```ts
const exponentSeries = [[1, 2, 4, 8], [1, 3, 9, 27], [1, 4, 16, 64]]
```

We would like to safely try to get the first cell.
```ts
const maybe2sSeries: Maybe<number[]> = getFirstElementOfArray(exponentSeries)
const maybeFirstCell: Maybe<Maybe<number>> = mapMaybe(maybe2sSeries, getFirstElementOfArray)
```

Oh no! We're _mostly_ there but `maybeFirstCell` is of type `Maybe<Maybe<...>>`,
which is not really what we want. Importantly though, the information is there;
we just want to lose some of it.

Because we're lazy, let's just make a helper function to flatten those nested
`Maybe`'s.

```ts
function joinMaybe(nestedMaybe: Maybe<Maybe<T>>): Maybe<T> {
  if(nestedMaybe.type === 'nothing') {
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

# Monad review

A functor is a structure for which you can implement a function like this:
```ts
type SomeStructure<T> = /* your structure */
declare function mapStructure<T, U>(structure: SomeStructure<T>, transformContents: (data: T) => U): SomeStructure<U>
```

Some functors are monads, if you can additionally implement a function like this:
```ts
declare function joinStructure<T>(nestedStructure: SomeStructure<SomeStructure<T>>): SomeStructure<T>
```

## Further thought

Functors are probably the most self-evident structure around. Their most
apparent problem is that combining distinct structures gets ugly fast:

```ts
const maybeFirstName: Maybe<string> = just('jane')
const maybeLastName: Maybe<string> = nothing
const maybeName: Maybe<Maybe<string>> = mapMaybe(maybeFirstName, (firstName) => {
  return mapMaybe(maybeLastName, (lastName) => {
    return firstName + ' ' + lastName
  })
})
```

Monads are the most obvious solution to this functor problem.

What's interesting is to find patterns between functors which are monads and
functors which are not monads:
* **lists** are functors, and monads.
* **trees** are functors, but not monads.

What sets lists apart from trees? Both can be used to store multiple things in one
thing. **From one perspective**, lists can be thought of as representing the
_concept of many things_, where trees are just an arrangement of many things.
Extending this to the monads we've covered so far:
* list represents the _concept of many things_,
* promise represents the _concept of asynchronicity_,
* maybe represents the _concept of failing_.

Once we have the appropriate concept, we can freely combine.

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

In JavaScript, we can approximate an I/O type with `() => void`.

**We use it to separate pure from impure.** This will make our lives much easier
* when modularizing our code, and
* when integrating with libraries like React.

## Let's make sure we have a monad

These are our `map` and `join` functions:
```ts
type IO<T> = () => T

function mapIO<T, U>(io: IO<T>, transformContents: (data: T) => U): IO<U> {
  return () => transformContents(io())
}

function joinIO<T>(nestedIO: IO<IO<T>>): IO<T> {
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
function mapAtom<T, U>(anAtom: Atom<T>, transformContents: (data: T) => U): Atom<U> {
  return atom((get) => transformContents(get(anAtom)))
}

function joinAtom<T>(nestedAtom: Atom<Atom<T>>): Atom<T> {
  return atom((get) => get(get(nestedAtom)))
}
```

---

# Let's get codin'

If you'd like to follow along, open this StackBlitz:

https://stackblitz.com/edit/vitejs-vite-dttfki?file=src%2Fmain.ts,src%2Fcreature.ts

---

# Part 3: Haskell

> _"An open-source product of more than twenty years of cutting-edge research, it allows rapid development of robust, concise, correct software."_

— [](https://wiki.haskell.org)

---

# Why Haskell

The most important thing to understand about Haskell is that its purpose is
much different than the purpose of most languages.

Haskell is a universal but practical model of computation, **not** a language
for writing drivers or UNIX-style command-line utilities. In this sense, Haskell
can be thought of as _the_ general purpose language — in contrast to C, Java,
Python and JavaScript as _Domain Specific Languages_.

C and Rust will always have a place for as long as hardware stays the same.

# What Haskell

Haskell is built on functions, in the math sense:
* Haskell functions are **pure**: they don't write to stdout or create a file when they are evaluated.
* Haskell functions are **deterministic**: they don't do something different depending on the time of day or the state of the stock market.

Like math, Haskell is **immutable**. f(_x_) won't change your _x_!

---

# Haskell sample

Haskell is rooted in math, so let's see what the quadratic formula looks like
in Haskell. For now we'll just consider one root.

```hs
quadraticFormula :: (Double, Double, Double) -> Double
quadraticFormula = \(a, b, c) -> ((-b) + sqrt (b * b - 4 * a * c)) / (2 * a)
```

---

# Haskell sample

Haskell is rooted in math, so let's see what the quadratic formula looks like
in Haskell. For now we'll just consider one root.

```hs
quadraticFormula :: (Double, Double, Double) -> Double
quadraticFormula = \(a, b, c) -> ((-b) + sqrt (b * b - 4 * a * c)) / (2 * a)
```

We can move the arguments of the function expression to the LHS of `=`.
```hs
quadraticFormula :: (Double, Double, Double) -> Double
quadraticFormula (a, b, c) = ((-b) + sqrt (b * b - 4 * a * c)) / (2 * a)
```

---

# Haskell sample

Haskell is rooted in math, so let's see what the quadratic formula looks like
in Haskell. For now we'll just consider one root.

```hs
quadraticFormula :: (Double, Double, Double) -> Double
quadraticFormula = \(a, b, c) -> ((-b) + sqrt (b * b - 4 * a * c)) / (2 * a)
```

We can move the arguments of the function expression to the LHS of `=`.
```hs
quadraticFormula :: (Double, Double, Double) -> Double
quadraticFormula (a, b, c) = ((-b) + sqrt (b * b - 4 * a * c)) / (2 * a)
```

Let's try to consider both possible roots. One of the coolest features of Haskell
is that operators are just functions like any other, which means we can pass
either addition or subtraction itself as an argument.
```hs
quadraticFormula :: (Double, Double, Double) -> (Double, Double)
quadraticFormula (a, b, c) = (oneCase (-), oneCase (+))
  where
    oneCase :: (Double -> Double -> Double) -> Double
    oneCase plusOrMinus = ((-b) `plusOrMinus` sqrt (b * b - 4 * a * c)) / (2 * a)
```

---

# Haskell sample

Haskell is rooted in math, so let's see what the quadratic formula looks like
in Haskell. For now we'll just consider one root.

```hs
quadraticFormula :: (Double, Double, Double) -> Double
quadraticFormula = \(a, b, c) -> ((-b) + sqrt (b * b - 4 * a * c)) / (2 * a)
```

We can move the arguments of the function expression to the LHS of `=`.
```hs
quadraticFormula :: (Double, Double, Double) -> Double
quadraticFormula (a, b, c) = ((-b) + sqrt (b * b - 4 * a * c)) / (2 * a)
```

Let's try to consider both possible roots. One of the coolest features of Haskell
is that operators are just functions like any other, which means we can pass
either addition or subtraction itself as an argument.
```hs
quadraticFormula :: (Double, Double, Double) -> (Double, Double)
quadraticFormula (a, b, c) = (oneCase (-), oneCase (+))
  where
    oneCase :: (Double -> Double -> Double) -> Double
    oneCase plusOrMinus = ((-b) `plusOrMinus` sqrt (b * b - 4 * a * c)) / (2 * a)
```

So far we've been ignoring no-root cases. Let's consider them too.
```hs
quadraticFormula :: (Double, Double, Double) -> [Double]
quadraticFormula (a, b, c) = if discriminant > 0
  then [oneCase (-), oneCase (+)]
  else if discriminant == 0
    then [oneCase (+)]
    else []
  where
    oneCase :: (Double -> Double -> Double) -> Double
    oneCase plusOrMinus = ((-b) `plusOrMinus` sqrt discriminant) / (2 * a)
    discriminant = b * b - 4 * a * c
```

---

# Modeling problems

## Case problem

We want to run Hearts, a game of playing cards. We just started planning, and haven't written any code yet:
* we haven't yet decided if we want to play it in a GUI or a CLI,
* we only plan on supporting hotseat, but would like it to be easy to add versus-computer or online multiplayer

Seems like it's time to bust out the UML. We just _can't_ mess up our class
hierarchy now, or it's going to be so much pain later!

## Analysis paralysis

We have so many tools, yet such few guiding principles.

---

# Modeling problems

Let's put aside trying to solve every problem in our head, and start describing
our data. We'll definitely need a `Card`, which will be made of a `Rank` and a
`Suit`.

```hs
data Suit = Hearts | Diamonds | Clubs | Spades
  deriving (Eq, Show)

data Rank
  = R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 | R9 | R10
  | Jack | Queen | King
  deriving (Eq, Show)

data Card = Card Suit Rank
  deriving (Eq, Show)
```

We've decided to use this `Rank` enum instead of integers to be a more typesafe,
but that means we won't be able to use `>`, unless...

```hs
instance Ord Rank
  compare r1 r2 = compare (intOfRank r1) (intOfRank r2)
```

In Haskell, we can use `>` and friends on any type which defines an instance of
`Ord`. We've heard instance before in this presentation, in the context of
Array's functor instance. Both uses are referring to the same thing — `Ord`
and `Functor` are both _typeclasses_, as are `Eq` and `Show`. The `deriving`
parts of our data declarations tell Haskell to figure out the implementation of
the instances for us.

Let's finish off our data by defining `intOfRank`. Many functional programming
languages provide an extremely expressive feature called _pattern matching_:
```hs
intOfRank :: Rank -> Int
intOfRank R1 = 1
intOfRank R2 = 2
intOfRank R3 = 3
-- ...
intOfRank Jack = 11
intOfRank Queen = 12
intOfRank King = 13
```

---

# Modeling problems

A deck is just a collection of cards. We'll use lists for simplicity, but later
we may find that using sets is more useful. For historical reasons, Haskell uses
this inconsistent syntax for list types:
```hs
type Deck = [Card]
```

We know we'll need a function to count the number of hearts in a Deck. We'll
start with an `isHeart` function and give `countHeartsInDeck` a signature.
Counting the number of items in a list which match a condition seems like a
common enough problem there might just be a function for it in the standard
library. We're new to the whole Haskell thing, so we don't have the entire
standard library memorized.

So, let's check **Hoogle** to see if any functions with a signature like
`(a -> Bool) -> [a] -> Int` exist. While we're at it, we can set our
implementation to `undefined` so the IDE stops bothering us. This will make it
clear to us later that we aren't done yet.

```hs
isHeart :: Card -> Bool
isHeart (Card Hearts _) = True
isHeart _ = False

countHeartsInDeck :: Deck -> Int
countHeartsInDeck = undefined
```

From Hoogle, it seems we're out of luck. We'll have to do it ourself.
```hs
countHeartsInDeck deck = length (filter isHeart deck)
```

When we're just passing the result of one function to another, we can use
_function composition_.
```hs
countHeartsInDeck deck = (length . filter isHeart) deck
```

Notice that our function is accepting a parameter just to pass it to another
function. This means both functions are actually equal!
```hs
countHeartsInDeck = length . filter isHeart
```

---

# I/O in Haskell

Haskell functions are pure, so they can't run I/O, and Haskell *only* has
functions and inert data. So it would seem Haskell can't run I/O — and you'd be
correct.

Haskell may not be able to run I/O, but someone else can: your machine! Let's
prepare instructions for your machine to write to stdout:

```hs
main :: IO ()
main = putStrLn "Hello World"
```

We're exporting this `IO` expression as `main`, which our runtime recognizes,
imports and executes.

Let's work up to echoing from stdin. We'll need these functions:
```hs
putStrLn :: String -> IO ()  -- write to stdout
getLine :: IO String  -- read from stdin
```

In this presentation we've already mentioned I/O as a monad. Here, `>>=` is like
`.flatMap`.

```hs
getThenPutLn :: IO ()
getThenPutLn = getLine >>= putStrLn  -- getLine.flatMap(putStrLn)
```

`>>=` is defined like so:
```hs
(>>=) someMonadValue someFunction = join (fmap someFunction someMonadValue)
```

or, more compactly and idiomatically:
```hs
(>>=) m f = join (fmap f m)
```

---

# I/O forever

We want to run some IO forever. How can we do that with no `while(true)` loops?
As with any hard problem, let's try the simplest case.

Here's how we could run it twice:
```hs
echoForever :: IO ()
echoForever = getThenPutLn >>= (\_ -> getThenPutLn)
```

Notice that `getThenPutLn` and `echoForever` are both of type `IO ()`. What if
we substituted the second `getThenPutLn` for `echoForever`?
```hs
echoForever :: IO ()
echoForever = getThenPutLn >>= (\_ -> echoForever)
```

In most languages, a recursive function with no terminating condition would hang
forever until memory runs out. Haskell is different.

## Lazy evaluation

Haskell uses _lazy evaluation_, which is the last notable feature we'll cover.
Lazy evaluation means Haskell won't try to evaluate the entirety of
`echoForever` (which would hang), and will instead evaluate the next level of
`getThenPutLn` only after the last one "finishes".

Lazy evaluation has a few advantages, especially for a language as abstract as
Haskell:
* Infinite data structures, like `echoForever`, need no special consideration
* If we made our own `&&` operator, it would short-circuit like the language-level feature `&&` usually is
* Passing extra parameters doesn't hurt: if the consumer doesn't need it, they won't have to pay the price of evaluating it

Most of all, it enables composition. Consider this problem:
```hs
aVeryBigDeck = -- suppose it was millions of cards long
firstFiveHearts = take 5 (filter isHeart aVeryBigDeck)
```

Without lazy evaluation, we would've filtered the entire list to only take the
first five. We could've made a `takeFiltered` function, but we certainly don't
want to rewrite every combination of standard functions!

---

# First half wrap-up

That's it for the first half!

## Recap

We looked at monads both in theory and in practice, and looked at some of
Haskell's most distinguishing features (in my opinion):
* Purity and immutability
* Operators are just functions which can be user-defined
* A taste of Algebraic Data Types (those `data` declarations), along with
* Typeclassing
* Pattern matching
* Function composition
* Lazy evaluation

## Next up

If you'd like to stick around for the second half, we'll cover:
* Recursive Algebraic Data Types (ADTs) & Monoids
* Lambda Calculus

## Source

https://github.com/probeiuscorp/fslc-presentations

---

# Recursive ADTs

Back in the quadratic formula sample, we made some lists. What are these lists
made of, and how can we use them if we can't mutate some `i` index?
```hs
data MyList a = MyListItem a (MyList a) | MyListEnd

-- Sample usages
emptyList = MyListEnd
oneItemList = MyListItem "only data" (MyListEnd)
twoItemList = MyListItem "first data" (MyListItem "second data" (MyListEnd))
```

How do we use recursive ADTs? Recursive functions!
```hs
lengthOfList :: MyList a -> Int
lengthOfList (MyListItem head rest) = 1 + lengthOfList rest
lengthOfList MyListEnd = 0
```

In standard Haskell, `MyListItem` is `:` and `MyListEnd` is `[]`:
```hs
lengthOfList :: [a] -> Int
lengthOfList (x:xs) = 1 + lengthOfList xs
lengthOfList [] = 0
```

Here's a sample binary tree.
```hs
data BinaryTree a = BNode a (BinaryTree a) (BinaryTree a) | BEmpty

sampleTree = BinaryTree "parent" (BinaryTree "left" BEmpty BEmpty) (BinaryTree "right" BEmpty BEmpty)
```

---

# Lists

For practice, let's write a function to find the max of a list of numbers.
```hs
maxOfList :: [Int] -> Int
maxOfList (x:xs) = max x (maxOfList xs)  -- `max` returns the greatest of its two arguments
maxOfList [] = 0
```

Finally, let's write a `Functor` instance for lists.
```hs
mapList :: (a -> b) -> [a] -> [b]
mapList f (x:xs) = (f x) : (mapList f xs)
mapList f [] = []
```

All these functions are eerily similar. Can we abstract away the pattern
matching?
```hs
foldList :: (a -> b -> b) -> b -> [a] -> b
foldList combine ifEmpty (x:xs) = combine x (foldList combine ifEmpty xs)
foldList combine ifEmpty [] = ifEmpty

-- Now,
maxOfList = foldList max 0
lengthOfList = foldList (const (+1)) 0
mapList f = foldList ((:) . f) []
```

In standard Haskell, our `foldList` is `foldr`.

I like to call functions of the type `a -> b -> b` _reducers_. The name comes
from JavaScript's Array `.reduce`.

If you've ever done front-end development with React, you're probably familiar
with Redux. Redux also uses the term reducer, for its functions of the
signature: `(state: TState, action: TAction) => TState`. The name also comes
from `.reduce`. All these concepts are interconnected!

---

# Monoids

With functions like `a -> b -> b`, what happens when `a` and `b` happen to be
the same?

Functions of the type `a -> a -> a` relate to _monoids_, a certain algebraic
structure (bonus points: monoids have already been mentioned in this
presentation before).

What is a monoid? The exact mathematical definition is a bit involved for us
here, but in essence a monoid is:
* a set _S_,
* a binary function (•) which works on _S_, and
* an identity element _e_.

Example monoids:
 * _S_ = non-negative numbers, (•) = addition, _e_ = 0.
 * _S_ = strings, (•) = string concatenation, _e_ = empty string

Here is the monoid as a typeclass in Haskell:
```hs
class Monoid a where
  mempty :: a
  mappend :: a -> a -> a
```

Maybe I'm the only one who gets a kick out of abstract algebra, but is that not
SO COOL!

Throughout Haskell's standard libraries and public packages you'll find
mathematics harnessed to improve our code, our efficiency and ultimately our
lives.

---

# Lambda calculus

On the topic of math and functional programming, let's pay a brief visit to the
beautiful world of _lambda calculus_.

In the 1930's, two different models for the theory of computability emerged:
* Turing machines, pioneered by Alan Turing
* Lambda calculus, pioneered by Alonzo Church

Both are capable of computing all things computable.

Haskell, as you may have guessed, is built off of lambda calculus. As its
influence on Haskell — and what "lambda" now means (in languages like Python) —
would suggest, lambda calculus is all about unary functions.

Unlike Haskell, lambda calculus _only_ has functions. This is the simplest
lambda:

```
λx. x
```

It evaluates to exactly what it is given. What can we give it? Other functions.
We _only_ have functions.

## The entire kitchen sink

We separate arguments from the target function with spaces, like in Haskell.
```
λf. λa. f a
```

To save us some writing, we can fold up multiple nested functions with this
handy syntax:
```
λf a. f a
```

And there we have it! You now know all of (simply untyped) lambda calculus'
syntax.

---

# Data in lambda calculus

Notably, we're lacking data, or anything that resembles it. Let's start with the
simplest: booleans.

## Booleans

What _is_ a boolean? We're not in the business of ontology, so let's think of it
as a _choice_. We can use a boolean to decide between two options. This seems
workable:

```
T = λx y. x
F = λx y. y
```

Surely we'll need some logical operators. Note that in the following samples I
will be using names (like `T` and `F`) which are in some sort of "global scope".
Lambda calculus does **not** necessarily allow this. We'll address this later.

```
not = λk. k F T
and = λx y. x y F
or  = λx y. x T y
xor = λx y. or (and (not x) y) (and x (not y))
```

## Natural numbers

Now, what _is_ a natural number? Certainly a valid perspective is an amount of
function applications.

```
0 = λf a. a
1 = λf a. f a
2 = λf a. f (f a)
3 = λf a. f (f (f a))
```

Some operations:
```
succ = λx. λf a. f (x f a)
add  = λx y. x succ y
mult = λx y. λf a. x (y f) a
```

---

# Final thoughts on lambda calculus

Let's return to the issue of global scope. Lambda calculus does not offer a
global scope, or `where` clauses.

Here's `and` written in terms of `F` with no reliance on a global scope:
```
(λF. λx y. x y F) (λx y. y)
```

We define a function and then immediately evaluate it with `F`'s definition,
binding the definition to `F`.

This pattern can be used in any language with function expressions and allows us
to create bindings entirely in expressions.

## And that's it!

Any questions?

### Source
https://github.com/probeiuscorp/fslc-presentations
