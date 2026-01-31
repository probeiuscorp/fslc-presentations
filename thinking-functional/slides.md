# Thinking functional

This presentation will have three main parts
- An introduction to lambda calculus, to get a feel for it
- Follow-along coding in the functional language Haskell to sell its power
- A look through some common tools to see the functional mindset

## Goals

- Show how to NOT think imperatively
- Show how to think functionally

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
- **Product types**.
<!-- pause -->
- **Sum types**.
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

- https://play.haskell.org/
- https://www.haskell.org/get-started/

---

# Functional principle in action

- Git
- React
- NixOS

---

If you're interested in functional programming, there's two ways I'd recommend

- **Purity in the TypeScript playground**.
- **Trying out Haskell**.
