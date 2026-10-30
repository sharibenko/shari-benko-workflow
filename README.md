# Shari Benko

Product design, research, and leadership across connected devices, enterprise interfaces, and consumer experiences.

[Portfolio](https://www.sharibenko.com/) · [LinkedIn](https://www.linkedin.com/in/sharibenko)

## Contents

- [Resume](content/resume.md): existing Ford Visual Design Lead draft, retained as a starting point. Review before using as a general resume.
- [Selected work](content/projects.md): short summaries linked to the portfolio.
- [Contribution workflow](CONTRIBUTING.md): branches, checks, reviews, and merging.
- [Repository settings](docs/repository-settings.md): intended GitHub configuration and activation steps.
- [Sources](docs/sources.md): provenance and content review notes.

## Structure

```text
.github/    CI, dependency updates, and pull request template
assets/     Images and exported documents
content/    Resume and project summaries
docs/       Supporting documentation
scripts/    Maintenance and validation
src/        Future application code
tests/      Automated tests
```

## Local checks

Use Node.js 24; no package installation is needed.

```sh
npm run check
npm test
```

CI runs the same commands on pull requests and pushes to `main`. There is no website build or deployment yet. Add framework linting, type checking, and a production build when application code is introduced.

Keep application tracking and recruiter details in the existing private application workspace. This repository starts with professional content and development conventions.
