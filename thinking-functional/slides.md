# Thinking functional

This presentation will have three main parts:
- An introduction to **lambda calculus**, to get a feel for it
- Code-along in the functional language **Haskell** to sell its power
- A look through some **common tools** to see the functional mindset

## Goal

The goal of the presentation is to show how to think functionally!

You don't need to become an expert or even comfortable in lambda calculus or Haskell.
I want to raise awareness that there's a different way to do computation,
from there if you feel inspired I'd love it if you looked into Haskell more.
Trying Haskell is the way to seriously learn functional programming
(and how wonderful it is!)

## Haskell

This presentation features a code-along in Haskell.
If you'd like to participate you can

- Install Haskell at https://haskell.org/get-started/
- Try it online at https://play.haskell.org/saved/U97CJahX/

You'll also need the starter code.
Clone it at https://github.com/probeiuscorp/fslc-dependent-types
and find it in **thinking-functional/demo/**.

---

# Computability

In the 1930s mathematicians made a big stink about computability.

There are two models of computability that concern us:

- **The Turing machine** by Alan Turing
- **The Lambda Calculus** by Alonzo Church

---

# Why Lambda Calculus

Functional programming languages trace their roots to this lambda calculus.

> λx. x

Lambda calculus can be summarized with a few key principles:
<!-- pause -->
- **Expression oriented**. Lambda calculus does not have statements or declarations.
<!-- pause -->
- **Purity**. No side effects -- expressions are only made useful by what they evaluate to.
<!-- pause -->
- **Immutability**. _f(x)_ won't change your _x_!
<!-- pause -->
- **Recursion**. There are no i's to increment -- only recursion.

---

# How Lambda Calculus

Lambda calculus principles:
- **Expression oriented**. Lambda calculus does not have statements or declarations.
- **Purity**. No side effects -- expressions are only made useful by what they evaluate to.
- **Immutability**. _f(x)_ won't change your _x_!
- **Recursion**. There are no i's to increment -- only recursion.

<!-- pause -->

Let's do some pen and paper computation.
<!-- pause -->
- **Identity function**. The simplest lambda value is (λx. x)
<!-- pause -->
- **Booleans**. We have "true" as (λx y. x) and "false" as (λx y. y)
<!-- pause -->
- **Naturals**. Search for "Church encoding" to learn more
<!-- pause -->
- **Omega combinator**. (λx. x x) (λx. x x) -- expression that cannot be reduced
<!-- pause -->
- **Product types** and **Sum types**. These are definitely worth looking into if "functions are data" intrigues you.

---

# Example: Addition

First let's define a little helper.
> SUCC = λn. λf a. f (n f a)

<!-- pause -->

We're now ready to compute `2 + 1`:
> SUM_NATS TWO ONE

---

# Example: Addition

First let's define a little helper.
> SUCC = λn. λf a. f (n f a)

We're now ready to compute `2 + 1`:
> SUM_NATS TWO (λf a. f a)

---

# Example: Addition

First let's define a little helper.
> SUCC = λn. λf a. f (n f a)

We're now ready to compute `2 + 1`:
> SUM_NATS (λf a. f (f a)) (λf a. f a)

---

# Example: Addition

First let's define a little helper.
> SUCC = λn. λf a. f (n f a)

We're now ready to compute `2 + 1`:
> (λn m. n SUCC m) (λf a. f (f a)) (λf a. f a)
<!-- pause -->
> (λm. (λf a. f (f a)) SUCC m) (λf a. f a)
<!-- pause -->
> (λf a. f (f a)) SUCC (λf a. f a)
<!-- pause -->
> (λa. SUCC (SUCC a)) (λf a. f a)
<!-- pause -->
> SUCC (SUCC (λf a. f a))
<!-- pause -->
> SUCC ((λn. λf a. f (n f a)) (λf a. f a))
<!-- pause -->
> SUCC ((λf a. f ((λf a. f a) f a)))
<!-- pause -->
> SUCC ((λf a. f (f a)))
<!-- pause -->
> SUCC (λf a. f (f a))
<!-- pause -->
> (λn. λf a. f (n f a)) (λf a. f (f a))
<!-- pause -->
> (λf a. f ((λf a. f (f a)) f a))
<!-- pause -->
> (λf a. f ((f (f a))))
<!-- pause -->
> λf a. f (f (f a))
<!-- pause -->
> THREE
---

# Functional programming languages

Unfortunately or fortunately no one uses plain lambda calculus to write programs.
For reasons that would appeal to mathematicians,
there's a whole family of lambda calculus variants, **the Lambda Cube**.

https://en.wikipedia.org/wiki/Lambda_cube
_Look at your own risk_

Two notable functional programming languages, Haskell and ML,
base themselves off Hindley-Miller while
Lean is based off the Calculus of Constructions.

---

# Haskell

> _"An open source product of more than twenty years of cutting-edge research, it allows rapid development of robust, concise, correct software."_

Haskell is my favorite language (~~that I'm not making~~).

- https://www.haskell.org/get-started/
- https://play.haskell.org/

If you'd like, please code along!
Install Haskell or try the online version, and
git clone the demo and navigate to **thinking-functional/**:

> https://github.com/probeiuscorp/fslc-presentations

<!-- pause -->

## IO

We'll see a bit of IO in Haskell, but that is far from the focus of this presentation.

> Haskell doesn't have _side effects_, but that doesn't mean it can't have _external effects_.

---

# Functional principle in action

- Git
- React
- NixOS

---

If you're interested in functional programming, there's two ways I'd recommend

- **Purity in the TypeScript playground**.
- **Trying out Haskell**.
