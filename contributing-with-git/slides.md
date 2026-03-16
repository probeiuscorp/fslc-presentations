# Contributing with Git

## Goals

## Non-goals

- Comprehensive

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

As you can imagine, having a separate copy of _every_ file for _every_ commit would be untenable.
Thus commits store _diffs_, which is the difference between the (contents of) two commits.

<!-- pause -->

Your Git history is your commits and their lineage.

We get a new **branch** whenever multiple commits share the same parent.
If we want to bring two branches back together, we can **merge** them.
Merging creates a merge commit which has two parent commits.

So, your Git history is a _directed acyclic graph_ (DAG).

---

# Why Git?

Git offers many advantages even for the solo developer:

- restore to a last known good version if you don't like the current experiment
- organize how your project has changed over time
- keep track of multiple concurrent efforts
- help investigate when bugs/regressions were introduced

<!-- pause -->

For this presentation though we're interested in how Git aids collaboration.

To collaborate via Git, the most basic approach is to
1. have a `main` branch
<!-- pause -->
2. everyone picks up features and makes a branch for each one
<!-- pause -->
3. when someone is done, they make a _pull request_ (PR) to main
<!-- pause -->
4. everyone else reviews that PR and if it looks good, that branch gets merged into main
<!-- pause -->

**However**, it'd be awful if we all had to SSH into one directory --
we each would like our own local copy of the code!

---

# Remotes

We now describe the _repository_.
The repository is whatever holds the data of all the commits, branches, tags.

If you're editing files and making commits, chances are the repository you're working in is hosted in a directory.
Such a repository would've been made by:

> `git init`

<!-- pause -->

Importantly repositories may have _remotes_.
A remote is another repository that your repository is setup to talk to.
Remotes may be
- fetched from (copy commits over from)
- pushed to (copy commits over to)

<!-- pause -->

You could have such a remote be another directory on the same machine (such as a fresh build repo),
but typically most people have just one remote — `origin`.
All developers
- push their ready work to `origin`, and
- regularly pull from `origin` to get updates from others.
