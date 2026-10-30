# Contributing

## Daily workflow

1. Start from an updated `main`: `git switch main` then `git pull --ff-only`.
2. Create one short-lived branch per change: `git switch -c codex/update-summary`. Use `codex/<short-description>` for agent work; `feat/`, `fix/`, `docs/`, or `chore/` for human work.
3. Keep the change focused. Prefer a reviewable PR of roughly 300 changed lines or fewer, excluding generated assets; this is guidance, not a gate.
4. Run `npm run check` and `npm test`. Add behavior tests for code changes that warrant them. Review content changes for factual accuracy and attribution.
5. Open a PR to `main` with the problem, change, and validation. Use a draft PR if work is unfinished.
6. Resolve conversations and wait for `quality` to pass. For solo work, self-review the diff; when another maintainer contributes, request review.
7. Squash merge with a clear title such as `docs: update resume summary`, then delete the branch.

No permanent `develop` branch, release branches, issue requirement, or mandatory outside approval for solo work. Keep `main` usable. Open issues for work that needs tracking; tiny edits can go straight to a PR.

## Coding conventions

- Use two spaces, UTF-8, LF line endings, and a final newline. Avoid trailing whitespace.
- Prefer descriptive names, small functions, built-in APIs, and the existing style. Add a dependency only when it removes meaningful complexity.
- Test changed behavior and important error paths. Avoid tests that only repeat implementation details.
- When adding a UI, use semantic HTML, keyboard access, visible focus, descriptive links, and text alternatives. Check the changed flow at desktop and mobile sizes.
- Add framework linting, type checking, and build commands to `quality` when a framework is chosen. The starter checks do not replace those tools.
- Keep credentials in environment variables or GitHub secrets. Commit an `.env.example` with empty example values only if configuration is needed.

## Content conventions

Use the resume and portfolio as evidence. Preserve collaborator attribution. Do not invent metrics, project outcomes, dates, or responsibilities. Verify dates and current roles before publishing. Keep submitted application versions immutable in the separate application tracker.

## Merging and rollback

PR titles use `feat:`, `fix:`, `docs:`, `test:`, or `chore:` followed by a plain description. Commits within a branch can use ordinary descriptive messages; squash merging produces one clean change on `main`.

Update branches from `main` when resolving conflicts or required checks demand it. Do not force-push `main`. Undo a merged change with a revert PR. Tag releases only when there is a useful downloadable milestone; use `vMAJOR.MINOR.PATCH` once releases exist.
