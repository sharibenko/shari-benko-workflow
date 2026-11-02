# Work Log

This is a curated project progress record, not the raw conversation journal.
Dates use America/Chicago. Exact action times are not reconstructed from chat.

## November 2, 2026

### Project tracking established

- Confirmed access to the Jira site and existing Shari Benko Workflow project.
- Changed the project key from KAN to SBW; existing planned tasks retain their
  numeric suffixes. Jira lists KAN as a previous project key.
- Set the workflow to Backlog -> In Progress -> Review -> Done, removing the
  extra Approved status after explicit authorization.
- Archived example Task 1 and Task 2 so they no longer appear as active work.
- Verified the active list contains only the eight planned tasks. The example
  SBW-3 is no longer listed; this log does not assert its removal mechanism.
- Jira subscription billing was not inspected; Free remains the selected plan.

### Initial backlog

| Key | Scope |
| --- | --- |
| SBW-4 | Historical conversation retrieval and timestamp availability |
| SBW-5 | Prompt, completion, interruption, and tool-hook investigation |
| SBW-6 | Controlled proof of exact live capture |
| SBW-7 | Process-mining data contract and case boundaries |
| SBW-8 | Durable local logging, correlation, and categorization |
| SBW-9 | Artifact capture and screenshot adapters |
| SBW-10 | Mining preparation, validation, and export |
| SBW-11 | Searchable journal and workflow discovery pilot |

### First implementation prerequisite started

Moved SBW-7 to In Progress because collection needs a defined event/case contract.
Drafted [Process Mining Data Contract](Process%20Mining%20Data%20Contract.md),
covering identity, case boundaries, time quality, delivery/deduplication,
classification history, evidence, and reproducible mining exports.

Only documentation and tracking work have started. No capture hooks, local
database, private research repository, automated screenshots, or mining pipeline
have been installed.

### Contract approval and acceptance review

Shari approved the contract and authorized merging it. Added an acceptance matrix
against SBW-7 and synthetic walkthroughs with expected outcomes. The specification
requirements are satisfied; capture and export implementation tests remain in
their respective future tasks. Repository validation and all three existing tests
pass. Merge and ticket completion are recorded in GitHub and Jira.

Created separate architecture task SBW-12 in Backlog for a Markdown deliverable
with a Mermaid diagram, component boundaries, private/public data flow, and the
publication approval boundary. Next investigations are SBW-4 and SBW-5.
