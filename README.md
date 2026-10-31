# Shari Benko Workflow

This project explores how ideas become finished work through conversations, design iterations, generated artifacts, and Git changes. Private research will use chronological workflow records and process mining to identify workflow models, revision patterns, and opportunities for improvement. This public repository will share selected results and insights approved by Shari Benko.

The final public output will be an HTML page explaining my product design process, from initial idea to delivery, supported by approved examples and visual evidence. It will suggest practical workflow improvements, distinguish observations from interpretations, and describe how to evaluate changes over time. The page and its recommendations will evolve as more work is captured and reviewed for publication.

A comparison with a completed design project will examine shared activities, sequences, revision loops, and decision points while accounting for differences in context and available evidence. The findings will help distinguish improvements that may apply across projects from those requiring adaptation. Shared patterns will remain candidates for further study rather than universal characteristics of design.

## Purpose of this public repository

- Present the HTML page describing my product design process.
- Share approved workflow models, findings, and improvement recommendations.
- Include selected examples and visual evidence reviewed for public release.
- Maintain the source code and documentation needed to build and present those
  public outputs.

## Private research and data

The recommended setup separates research, data storage, and public presentation:

| Component | Planned location |
| --- | --- |
| Capture tools, analysis code, internal planning, and unpublished findings | Separate private research repository |
| Full conversations, timestamps, categories, and event relationships | Local SQLite database outside Git repositories and synchronized folders |
| Original screenshots, documents, and generated images | Local private artifact folder linked to the database |
| Backups | Encrypted external drive; optional encrypted off-site backup |
| Approved HTML page, examples, and insights | This public repository |

Publication will follow this sequence:

```text
Collect privately -> Analyze privately -> Review selected exports -> Publish approved results
```

## Current status

The project is in planning. This repository has initial documentation, basic
validation checks, and professional reference content from its original setup.

Jira Cloud Free has been selected for project tracking. The private research
repository, local SQLite database, backup process, and Jira project have not yet
been set up. Capture hooks, historical conversation retrieval, screenshot
adapters, and the process-mining pipeline still require investigation and
implementation. No event logger is running, and the HTML page is not built or
deployed.

The existing resume and portfolio summaries are reference material from the
initial setup. Their role in the public presentation will be reviewed as the
project develops.

## Project documentation

- [Contributing](CONTRIBUTING.md): branching, validation, review, and merge conventions.
- [Repository settings](docs/repository-settings.md): recorded GitHub configuration.
- [Sources](docs/sources.md): provenance for the initial professional content.
- [Product Goals and Planning](docs/Product%20Goals%20and%20Planning.md): goals,
  capture investigations, process-mining architecture, and delivery sequence.
- [Git Pipeline](docs/Git%20Pipeline.md): branching, checks, merging, and deployment plans.
- [Private Data Storage](docs/Private%20Data%20Storage.md): local database and backup recommendations.
- [Data Security Policy](docs/Data%20Security%20Policy.md): storage separation and public release controls.

## Repository structure

```text
.github/    CI, dependency updates, and pull request template
assets/     Approved public images and exported documents
content/    Existing professional references and future approved public content
docs/       Documentation approved for public release
scripts/    Maintenance and validation
src/        Future public presentation code
tests/      Automated tests
```

## Development basics

Use Node.js 24. The current checks require no package installation.

```sh
npm run check
npm test
```

Work on a short-lived branch, open a pull request, pass the required checks, and
squash merge into `main`. See the contribution guide for details.

The current pipeline provides continuous integration through formatting, local
Markdown link, JSON, JavaScript syntax, and validation-script checks. There is no
application build or deployment yet. Future deployment will publish only approved
public content after successful validation.

## About

Created by Shari Benko, drawing on product design, research, and leadership work.

[Portfolio](https://www.sharibenko.com/) | [LinkedIn](https://www.linkedin.com/in/sharibenko)
