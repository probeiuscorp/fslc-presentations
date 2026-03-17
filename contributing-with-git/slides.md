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
<!-- pause -->
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

---

# Open source

Open source projects however can't just give everyone push access.

Most projects will instead have prospective contributors
<!-- pause -->
- _fork_ (clone) the open source repository (creating their own origin)
<!-- pause -->
- push-pull to their fork while working
<!-- pause -->
- make a pull request from their fork to the open source project when done
<!-- pause -->

This is often called the GitHub model, or more precisely the **software forge** model.

<!-- pause -->

It is good to remember that many projects do not work this way.
The Linux kernel is probably the most notable.

For the Linux kernel patches are instead sent by email to subsystem maintainers who then forward the patch along up the chain.

---

# Putting it all together

If you'd like to contribute to the FSLC Sudoku game, clone this repository!

> git clone https://github.com/probieuscorp/fslc-sudoku.git

<!-- pause -->

There's some outstanding work I need your help to finish:

- functions to access Sudoku board in different ways (beginner JS arrays)
- handling of events to let user update the board (beginner JS events)
- track the initial cells, forbidding changes to them (intermediate, cross-cutting)
- check validity of Sudoku board (intermediate JS arrays)
- making the border for 3x3 subgrids thicker (intermediate CSS selectors)
