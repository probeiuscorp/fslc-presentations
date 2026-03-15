# Contributing with Git

## Goals

---

# Git basics

---

# What is Git?

Git tracks changes to files.
The code developers write is (with few exceptions) text files.

<!-- pause -->

## Commits

We can **commit** a version of the files whenever we feel it's worth preserving.

A commit is primarily two parts:
- the complete state of all the files
- a parent commit (or, parent _commits_)

<!-- pause -->

Your Git history is your commits and the links between them.

We get a new **branch** whenever multiple commits share the same parent.
If we want to bring two branches back together, we can **merge** them.
Merging creates a merge commit which has two parent commits.

So, your Git history is a _directed acyclic graph_ (DAG).
