# Git Pipeline

Documented October 30, 2026. This overview describes the configured repository
workflow. Contribution rules also appear in [CONTRIBUTING.md](../CONTRIBUTING.md),
and the last verified GitHub settings appear in
[repository-settings.md](repository-settings.md).

## Branch and merge workflow

1. Update local `main` with `git pull --ff-only`.
2. Create a short-lived branch. Agent branches use `codex/<description>`; human
   branches may use `feat/`, `fix/`, `docs/`, or `chore/`.
3. Make a focused change and run `npm run check` and `npm test` locally.
4. Commit, push the branch, and open a pull request targeting `main`.
5. Review the diff, resolve conversations, and wait for `quality` to pass.
6. Squash merge the PR. GitHub automatically deletes the merged remote branch.
7. Update local `main` before starting the next change.

The default branch is `main`, not `master`. There is no permanent `develop` or
release branch. Publishing a branch or opening a PR does not merge it.

## Continuous integration

The executable configuration is [ci.yml](../.github/workflows/ci.yml).

| Setting | Configuration |
| --- | --- |
| Triggers | Pull requests to `main`, pushes to `main`, and manual dispatch |
| Required job | `quality` |
| Environment | Ubuntu runner, Node.js 24 from `.node-version` |
| Commands | `npm run check` and `npm test` |
| Timeout | 5 minutes |
| Token permissions | Read-only repository contents |
| Concurrency | Superseded runs for the same PR or branch are cancelled |
| Action versions | Pinned to commit hashes; Dependabot proposes monthly updates |

The checks cover text formatting, inline local Markdown links, JSON parsing,
JavaScript syntax, and tests of the validation script. They do not currently
provide application behavior tests, framework linting, type checking, a production
build, or external-link validation.

## Main branch protection

As last verified in the repository settings document, `main` requires a pull
request, the `quality` status check, resolved review conversations, and linear
history. Protection includes administrators. Force pushes and branch deletion are
blocked. No outside approval is required for solo ownership; self-review is part
of the documented workflow. Only squash merging is enabled.

Markdown documents describe policy; GitHub settings enforce branch protection.
Recheck live settings if repository visibility or account plans change.

## Delivery and deployment

This is a basic CI pipeline. Continuous delivery/deployment is not configured.
There is no application build, website deployment, or automatic public release.

When the public HTML output is ready, add application checks and a build before
deployment. Publish only approved public files from a reviewed commit after
successful validation. Private prompts, research datasets, screenshots, and
database files must remain outside the public build and deployment inputs.

## Rollback

Undo a merged change through a revert pull request and the same checks. Do not
reset or force-push `main`.
