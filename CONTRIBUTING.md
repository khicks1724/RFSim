# Contributing to RF Planner

Thanks for your interest in contributing. This project is built and used by people across a range of backgrounds — RF / EW domain experts, software engineers, and folks somewhere in between. Contributions from all of them are welcome, including contributions assisted (or fully written) by AI tools. The project itself was built with substantial AI assistance, and we're not going to pretend otherwise.

This document is a **starting point**, not a final policy. The maintainer owns the final word, and everything here is open to discussion in the [contribution guidelines tracking issue](../../issues/2). If a rule below seems wrong, comment there.

## Before you contribute — a note on the roadmap

There is no public roadmap yet. Until one exists, please **file an issue first** describing what you'd like to work on, and wait for a maintainer acknowledgement before investing significant time in a PR. This avoids wasted effort on changes that don't fit the direction the maintainer has in mind.

A separate effort is underway to publish a roadmap; once it lands, this section will point at it.

## Filing an issue

The easiest way to contribute is to **open an issue**. On GitHub, click the **Issues** tab → **New issue**, and you'll be offered a set of templates that match the kind of work you have in mind:

| Template | Use when |
|---|---|
| **Bug Fix** | Something is broken or behaving incorrectly |
| **Feature Upgrade** | You want to enhance or extend existing functionality |
| **Refactoring** | The code structure should improve without changing behavior |
| **Chore** | Dependency bumps, CI tweaks, migrations, infra, docs |
| **Epic** | A larger initiative that will spawn several child issues |

Pick the closest match — don't worry about getting it perfect. Each template has a few short prompts (what's happening, steps to reproduce, acceptance criteria, etc.). Fill in what you know and leave the rest blank; a partial issue is much better than no issue.

### What makes a good issue

- **One thing per issue.** If you find two unrelated bugs, file two issues.
- **Be specific about what you saw vs. what you expected.** Screenshots, console errors, and reproduction steps are gold.
- **Link related issues** when you spot connections, especially under an Epic.

## Pull requests

### New to GitHub?

If this is your first time:

1. Make a free GitHub account if you don't already have one.
2. Fork this repo to your own account (the **Fork** button at the top right).
3. Clone your fork locally, create a branch off `main`, make your change, and push the branch to your fork.
4. Open a pull request from your fork's branch back to this repo's `main`.

If you'd rather just describe the problem and let someone else write the code, a well-filed issue is equally welcome.

### Small, direct PRs (provisional rule)

Direct PRs are welcome for small, contained changes. As a starting heuristic, "small" means:

- Roughly under **~200 lines changed**
- One logical area of the codebase
- No new dependencies
- No database schema changes

Examples that typically qualify: bug fixes, doc improvements, tests, UI tweaks, new entries in the radio library, refactors that don't change behavior.

This rule is provisional. Expect it to tighten as we see what kinds of contributions actually arrive.

### Larger or sensitive changes — design issue first

Anything bigger than the heuristic above, **or** anything that touches:

- Authentication / JWT / cryptographic code
- Database schema or migrations (`backend/sql/`)
- RF propagation math (`simulation-worker.js`)
- Deployment / infrastructure (`deploy/`)
- AI provider plumbing (`genai-proxy.js`)
- Anything that adds a new dependency

→ please **file a design issue first** (use the **Feature Upgrade** or **Epic** template), describe what you intend to build and why, and wait for maintainer sign-off before writing code. This protects everyone's time and keeps the most-fragile parts of the codebase from drifting on plausible-but-wrong changes.

### PR mechanics

- **One issue, one PR.** Reference the issue with `Refs #N` (keeps the issue open after merge) or `Closes #N` (closes it on merge).
- **Branch from `main`.** Use a descriptive branch name (e.g. `fix/coverage-overlay-flicker`, `feat/add-prc-150`).
- **Conventional-commit-style title prefix:** `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`.
- **Test locally.** At minimum, build the stack and exercise the affected feature in a browser. CI does not yet cover RF correctness — you do.
- **Keep PRs focused.** If you find unrelated issues while working, file them; don't fold them in.

## Working with AI / agentic tools

AI-assisted and fully agent-generated PRs are welcome, subject to the same scope rules as anything else.

- **Disclose tool use** in the PR description: which tool, and what was generated vs. hand-edited. This is a signal to reviewers, not a gate.
- **You are responsible for the diff.** You must have run the change, tested the affected feature, and be able to answer review questions about it. "The agent did it" is not a valid response to review feedback.
- **No agent-generated PRs in sensitive areas without prior approval.** Even if the diff is small, do not point an agent at auth, schema, RF math, or deployment code and open a PR cold. File a design issue first and get an explicit go-ahead. Plausible-but-wrong code is highest-risk in these areas.
- **No drive-by agent PRs.** Don't pick up an unassigned issue, run an agent on it, and open a PR without first commenting on the issue and getting an acknowledgement. This avoids duplicate work and keeps the issue-first norm intact.

## Review and merge

The maintainer reviews on a best-effort basis. SWE-heavy review may be light, so contributor self-review and local testing matter more here than on big-team projects. Help reviewers help you: small focused PRs, clear descriptions, linked issues, evidence of local testing.

**Where to discuss what:**

- **Code-level feedback** (typos, refactors, naming) → the PR thread.
- **Policy questions** (size threshold, sensitive paths, AI policy) → the [contribution guidelines tracking issue](../../issues/2).

## This document is provisional

The rules above are a starting point. Open questions — size threshold, sensitive-path list, PR template, agent instructions, roadmap structure — are tracked in the [contribution guidelines tracking issue](../../issues/2). Comments and counter-proposals are welcome.
