# GitHub settings

Verified October 30, 2026: [sharibenko/my-resume](https://github.com/sharibenko/my-resume) exists as a private repository with `main` as its default branch. Squash-only merging and automatic branch cleanup are enabled. The initial `quality` job passed on GitHub.

Branch protection could not be activated: GitHub returned HTTP 403 and required GitHub Pro or a public repository. Follow the PR and passing-check policy manually until the owner chooses an eligible plan or visibility. The requirements below describe the intended policy; they are not currently enforced.

| Parameter | Value |
| --- | --- |
| Suggested repository name | `my-resume` |
| Visibility | Private |
| Default branch | `main` |
| Merge method | Squash only |
| Delete merged branches | Enabled |
| CI required check | `quality` |
| Required pull request | Policy for `main`; enforcement blocked by account plan |
| Required approvals | 0 for solo ownership; 1 when another maintainer is available |
| Resolve review conversations | Required |
| Force pushes / branch deletion | Blocked for `main` |
| CI token | `contents: read` |
| CI timeout | 5 minutes |
| CI concurrency | Cancel superseded runs for the same PR or branch |
| Runtime | Node.js 24 |
| Dependency updates | Monthly, GitHub Actions only, maximum 2 open PRs |
| Deployment | None |

## Activate after creation

1. Create the repository with the chosen visibility and push the initial files to `main`.
2. In Settings > General > Pull Requests, enable squash merging only and automatic deletion of head branches.
3. Let the first Actions run finish. Confirm the `quality` job passes.
4. In Settings > Rules > Rulesets (or branch protection), target `main`. Require a pull request, `quality`, resolved conversations, and a linear history. Block force pushes and deletion. Do not require a second person's approval for solo ownership.
5. Verify enforcement with an ordinary PR. If the account plan does not support enforcing rules for the selected visibility, record the limitation here and follow the PR workflow manually.

Keep deployment separate from validation. When hosting is added, build and deploy only the reviewed `main` commit after successful checks.
