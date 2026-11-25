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

## November 3, 2026

Moved SBW-12 to In Progress and drafted
[Project Architecture](Project%20Architecture.md) on a separate architecture branch.
The Mermaid diagram and component descriptions cover live capture, historical
imports, private code and local storage, mining transformations, publication
review, public presentation, Jira tracking, and encrypted backup requirements.
Implemented components are distinguished from planned ones. No raw research data
is included. The architecture awaits Shari's review before public release.

Validated Mermaid rendering in a local browser using Mermaid 11.12.0 and inspected
the complete diagram. Repository formatting/link/syntax checks and all three
existing tests pass. The draft covers SBW-12's documented scope; Shari's review
and approval remain pending before publishing or merging it.

Clarified the architecture's new-work capture wording: integrations depend on
supported tool access, which has not yet been verified. Assigned the capability
investigation to existing SBW-5, with explicit response-capture and coverage
requirements; SBW-6 remains the subsequent capture proof. No new ticket is needed.

Clarified the diagram's backup node as encrypted backup on separate physical
storage, with device and schedule TBD. Verified SBW-8 already includes backup,
encryption, retention and restore planning before live collection; expanded its
scope with device/capacity, key recovery, frequency, disconnection/separate storage
and consistent database-plus-artifact restore acceptance. SBW-8 remains in Backlog;
no duplicate task was created and no hardware was selected or purchased.

Updated SBW-12's Mermaid diagram and legend to distinguish core solid flows,
the optional dashed cloud-backup path, thin gray dotted execution/reference
relationships, and explicitly conditional historical-import and review outcomes.
Separated withholding from revision, retained mandatory publication approval and
physical backup, added planned/exists labels, and reserved green accents for the
approved publication path. Meaning is conveyed through labels as well as styling.

Shari approved the revised architecture for publication and authorized a PR and
merge, followed by closing SBW-12 if its acceptance criteria are satisfied.
Removed an unfinished editing fragment from the introduction and updated the
architecture's approval status. Merge, CI and acceptance evidence will be recorded
in the pull request and Jira; implementation tasks remain separate.

## November 5, 2026

Started SBW-4 and moved it to In Progress. Drafted
[Historical Conversation Retrieval](Historical%20Conversation%20Retrieval.md)
on `codex/historical-retrieval`. Read-only app pagination reached this chat's first
input; a matching local transcript exposed message text, identities, turn references
and source creation times. Documented observed schema versus supported commands,
human-input/context separation, overlapping event representations, artifact gaps,
timestamp mapping and a proposed private import procedure. No raw conversation
was copied into Git, synchronized workspace files or Jira. No importer, archive
or database was installed; review and full import reconciliation remain pending.

Expanded SBW-4 following Shari's direction to support repeated intake of new and
existing projects. Added stable project/source/import-run relationships,
source-specific methods mapped to the shared contract, repeat-import identity and
correction rules, dimension-level coverage reports, live-capture reconciliation
and a second-source evaluation requirement. Cross-source access remains unverified;
no additional project's raw data was acquired and importer implementation remains
separate. Updated Jira scope to match; the draft remains in Review.

## November 8, 2026

Started SBW-5 on `codex/live-capture-investigation`. Drafted
[Live Capture Capabilities](Live%20Capture%20Capabilities.md) from current official
hook documentation and read-only CLI/config discovery. The local CLI reports
hooks enabled; actual handler delivery in this desktop chat remains unverified.
Documented candidate prompt/response/lifecycle/tool fields, orchestration and
coverage limits, privacy prerequisites and pending synthetic tests for SBW-6.
No hook was installed, trusted or enabled and no raw capture was added to Git.
SBW-5 remains In Progress; ordinary repository tests do not prove hook delivery.

## November 9, 2026

Merged the reviewed live capture plan through PR #9 with passing CI. Started
`codex/synthetic-capture-probe` for SBW-5 feasibility work. Prepared a passive,
session-allowlisted synthetic receipt handler, offline tests, and a
[setup and rollback guide](Synthetic%20Capture%20Probe.md). Refreshed official
documentation evidence for PreCompact/PostCompact candidates. No hook definitions
were installed or trusted; desktop delivery, steering, compaction continuity and
production capture remain unverified. Draft implementation awaits review.

## November 17, 2026

Reorganized [Synthetic Capture Probe](Synthetic%20Capture%20Probe.md) for human
review: plain-language purpose and methodology first, implementation reference
second, execution and evidence instructions third. Identified the input size and
timing limits as provisional author-selected assumptions requiring evaluation.
The handler code and configuration remain unchanged; no hooks were enabled and
the methodology draft awaits Shari's review.

## November 21, 2026

Added Shari's agreed long-pause scenario to
[Synthetic Capture Probe](Synthetic%20Capture%20Probe.md): resume after at least
10 hours, separately testing an open conversation and an app restart. The test
checks record availability, capture continuity and case identity, and distinguishes
elapsed gaps from active work. Clarified which conversation scenarios the review
question refers to. SBW-5 assesses feasibility; SBW-8 retains durable storage and
recovery scope. This is a methodology edit, not an executed runtime test; no hooks
were enabled.

Documented the mixed-topic scope-review rule in Synthetic Capture Probe: preserve
private originals, annotate message/activity scope separately, retain review and
correction history, and include only case-approved records in mining exports.
Excluded activities remain distinct from missing data and active working time.
Added a synthetic review walkthrough; classification and export filtering remain
future implementation work. No collection or publication was enabled.

## November 25, 2026

Shari authorized committing the reviewed synthetic capture methodology, prototype
handler and offline tests, pushing the branch and opening a PR. Updated the
methodology's review status while keeping activation setup and runtime evidence
pending. No hook configuration was installed or enabled; SBW-5 remains a
feasibility investigation.
