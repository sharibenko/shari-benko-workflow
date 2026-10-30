# Shari Benko Workflow

This project explores how ideas become finished work through conversations, design iterations, generated artifacts, and Git changes. It will capture a chronological workflow record and use process mining to identify workflow models, revision patterns, and opportunities for improvement.

The final output will be an HTML page explaining my product design process, from initial idea to delivery, supported by examples and visual evidence. It will suggest practical workflow improvements, distinguish observations from interpretations, and describe how to evaluate changes over time. The page and its recommendations will evolve as more work is captured.

A comparison with a completed design project will examine shared activities, sequences, revision loops, and decision points while accounting for differences in context and available evidence. The findings will help distinguish improvements that may apply across projects from those requiring adaptation. Shared patterns will remain candidates for further study rather than universal characteristics of design.

## Current status

This project is in planning. The repository includes initial documentation,
portfolio and resume reference content, and basic development checks.

We have selected Jira Cloud Free for project tracking. Jira setup, conversation
capture, screenshot automation, and process-mining implementation are still pending.
No event logger is running yet.

## Planned capabilities

- Preserve the full text of submitted chat inputs with available source timestamps
  and their original order.
- Categorize inputs by intent, work area, and output type.
- Connect inputs to observable actions, generated artifacts, and Git changes.
- Capture rendered website screenshots, document page images, and relevant GitHub
  browser views as visual evidence.
- Provide a searchable timeline linking conversations, activities, and outputs.
- Transform captured events into validated process-mining datasets and use them
  to discover and review workflow models.

Historical capture from the first message in this chat is an investigation goal.
Exact message and timestamp availability must be verified before promising a
complete archive.

## Approach

Begin with Jira setup, a process-mining data contract, and an investigation of
OpenAI prompt, completion, and interruption hooks. Prove capture in the current
chat environment before implementing the broader pipeline.

Keep raw events separate from derived classifications and mining exports. Use
stable identifiers to connect workflow cases, chat turns, Jira issues, artifacts,
commits, and screenshots. Record missing or failed captures explicitly.

Full conversations, screenshots, and working datasets will remain private by
default, outside this public repository. Only explicitly selected exports should
be published.

## Project documentation

- Product Goals and Planning (local draft, pending publication): detailed scope,
  architecture, implementation sequence, acceptance criteria, and open decisions.
- [Contributing](CONTRIBUTING.md): branching, validation, review, and merge conventions.
- [Repository settings](docs/repository-settings.md): GitHub configuration and status.
- [Sources](docs/sources.md): provenance for the initial professional content.

## Repository structure

```text
.github/    CI, dependency updates, and pull request template
assets/     Reviewed public images and exported documents
content/    Resume and portfolio reference content
docs/       Product goals, planning, and supporting documentation
scripts/    Maintenance and validation
src/        Future application code
tests/      Automated tests
```

The initial [resume draft](content/resume.md) and
[selected work](content/projects.md) provide professional context. The resume is
an existing application-specific draft and needs review before general use.

## Development basics

Use Node.js 24. The current checks require no package installation.

```sh
npm run check
npm test
```

Work on a short-lived branch, open a pull request, pass the required checks, and
squash merge into `main`. See the contribution guide for details.

The starter checks cover formatting, local Markdown links, JSON, JavaScript
syntax, and the validation script's tests. Application-specific checks will be
added as implementation develops. There is no application build or deployment yet.

## About

Created by Shari Benko, drawing on product design, research, and leadership work.

[Portfolio](https://www.sharibenko.com/) | [LinkedIn](https://www.linkedin.com/in/sharibenko)
