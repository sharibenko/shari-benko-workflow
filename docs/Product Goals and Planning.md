# Product Goals and Planning

Status: planning draft for review. Updated October 30, 2026.

## Product goal

Capture Shari Benko's interactions with this chat and the resulting work so that
process mining can reveal actual workflows, revision loops, variants, and delays.
Preserve the full submitted input and connect it to observable actions, output
versions, and visual evidence in chronological order.

The product includes a searchable workflow journal and a reproducible pipeline
that transforms captured events into process-mining data and workflow models.

## Decisions made

- Use the public GitHub repository `sharibenko/shari-benko-workflow` for code,
  documentation, and reviewed planning changes.
- Use Jira Cloud Free for project tracking. Proposed project name: Shari Benko
  Workflow; proposed project key: SBW. Site and project creation remain pending.
- Keep the event journal independent of Jira. Link Jira issue keys to cases;
  one issue may involve several workflow executions.
- Keep full conversations, screenshots, and working datasets private by default,
  outside Git and excluded from commits. Publish only explicitly selected exports.
- Preserve raw records and derive versioned classifications and mining datasets.

## Prerequisite: project tracking

Create or select a Jira Cloud Free site, then create the project and a simple
Backlog -> In Progress -> Review -> Done workflow. Track investigations,
implementation, validation, and unresolved decisions there.

Initial backlog:

1. Investigate exact historical conversation retrieval and timestamp availability.
2. Investigate and document prompt, completion, and interruption hooks.
3. Define the process-mining data contract and case boundaries.
4. Prove live capture in this desktop chat before promising coverage.
5. Implement durable event logging, correlation, and categorization.
6. Implement artifact capture and screenshot adapters.
7. Implement mining preparation, validation, and export.
8. Build the journal timeline and run a discovery pilot.

## Capture investigation

Verify whether the current desktop environment supports `UserPromptSubmit` and
whether it exposes exact submitted prompt text and a turn ID. Investigate `Stop`,
`Interrupt`, and relevant tool lifecycle hooks for completion, cancellation, and
observable actions. Document supported fields, configuration, permissions,
delivery guarantees, failures, and platform limitations using a tested example.

Do not assume hook availability or exact-once delivery. Test multiline inputs,
follow-up messages, interruptions, retries, concurrent work, and capture failures.
Assess a dedicated input interface backed by the OpenAI app server only if native
capture cannot meet the requirements. That alternative needs a separate decision
because it changes how inputs are submitted.

Investigate backfilling this conversation from its first input. Preserve exact
messages and original ordering wherever retrievable. Preserve source timestamps
when available; otherwise mark them unknown and retain the import timestamp.
Do not reconstruct exact messages from conversational summaries or invent dates.
Mark historical classifications as inferred. Import existing artifacts when
available; a screenshot taken now cannot represent an earlier interface state.

## Process-mining data contract

Define this contract before implementing the logger. A case is one bounded task,
such as "Revise portfolio homepage." A task may span chats, and a chat may contain
several tasks. Define case start, completion, cancellation, reopening, and
reassignment rules. Record uncertain assignments for review.

Activities are stable action labels such as Submit request, Generate artifact,
Request revision, Run validation, and Merge change. Categories describe the
activity's intent, subject, and output; they are separate from activity names.

| Field | Purpose |
| --- | --- |
| event_id | Unique identity and duplicate prevention |
| case_id | Workflow instance; unresolved assignments remain explicit |
| activity | Controlled action label |
| occurred_at | Source event time, nullable when unavailable |
| recorded_at | Time the logger received or imported the record |
| sequence | Observed order when timestamps tie; not proof of causality |
| actor | User, assistant, or tool identity/type |
| lifecycle, operation_id | Start/completion correlation where observable |
| status | Success, failure, cancellation, or pending |
| chat_id, turn_id, parent_event_id | Context and causal relationships |
| jira_issue_key | Optional project-tracking link |
| artifact_ids, commit_sha, screenshot_ids | Links to output evidence |
| categories, classification_version | Reproducible categorization |
| schema_version, source | Record format and provenance |

Preserve full input text with original line breaks in a linked raw record. Store
timestamps in UTC and display America/Chicago time with the applicable offset.
Capture submitted inputs; unsent typing is outside scope. Corrections are new
events rather than replacements for the original input.

Preserve many-to-many relationships between events, tasks, documents, commits,
and screenshots to support future object-centric analysis.

## Categorization

Start with a small editable vocabulary and allow multiple labels:

- Intent: request, revision, correction, question, decision, feedback.
- Work area: design, content, code, Git, testing, documentation, planning.
- Output: website, document, image, repository, other.

Write raw data first, then classify asynchronously. Start with simple rules;
evaluate model-assisted classification later. Preserve classification versions,
confidence or uncertainty, and manual correction history without changing raw text.

## Visual evidence

Associate every capture with its event, artifact version, capture time, and source.
Record viewport dimensions for browser captures and page numbers for documents.
Wait for browser fonts and images to settle before capturing.

| Output or action | Evidence to capture |
| --- | --- |
| Git push or merge | Actual GitHub browser view of the relevant commit, PR, or changed file, with URL and commit SHA |
| Local Git change | Local diff/version reference; GitHub screenshot remains pending until pushed |
| HTML or website | Rendered changed page at agreed desktop and mobile sizes |
| Document | Image of every page, linked to the source document version |
| Generated image | Original image and a preview when needed |

Capture before/after states when a prior version exists. A prompt can produce
several outputs or none. Record pending, failed, and unavailable captures explicitly
and support retries; never substitute a later state for historical evidence.

## Architecture and storage

```text
Prompt, tool, Git, and artifact capture
                  |
                  v
       Immutable raw event journal
                  |
                  v
Normalize -> correlate cases -> classify activities -> validate
                  |
                  v
       Versioned process-mining event log
                  |
                  v
       Discover and review workflow models
```

Keep implementation generic: capture adapters, journal writing, mining
transformation, and presentation should have separate responsibilities.
Use local SQLite as the authoritative event store, with append-only event records
and serialized writes. Generate JSONL exports from that store rather than
maintaining a second independent journal. Store captures separately and generate
a local timeline from the database. See the
[storage recommendation](Private%20Data%20Storage.md) and
[data security policy](Data%20Security%20Policy.md).
Choose the private storage location, backup policy, and retention rules before
live collection. Add ignore rules before creating any working dataset.

The timeline should support chronological browsing, full message expansion,
category filters, search, screenshots, and links to artifacts and Git changes.

## Mining preparation and validation

Produce a derived CSV event log with case ID, activity, and event timestamp as its
core fields. Provide XES export for interoperability. Keep raw text and image
files separate and link them through identifiers. Preserve transformation
versions, source event IDs, and export settings so a dataset can be reproduced.

Check missing case IDs and timestamps, duplicate events, inconsistent activities,
unmatched lifecycle events, capture gaps, and ordering problems. Report unresolved
records and export exclusions explicitly rather than silently discarding them.
Do not use capture/import time as an unmarked substitute for source event time.

Begin discovery with several complete cases and inspect the observed sequences
before interpreting a model. Compare workflow variants, revision loops, and
failures. Prompt-only data describes prompting behavior; broader workflow models
require tool, artifact, validation, review, and Git events too.

Time between messages is elapsed time, not automatically active working time.
Concurrent activities and incomplete capture must remain visible as limitations.

## Delivery sequence and acceptance

1. Set up Jira and record the backlog and decisions.
2. Define the data contract; investigate historical access and hook capabilities.
3. Prove exact live prompt capture and document coverage limits.
4. Implement durable logging, deduplication, correlation, and classification.
5. Add mining transformation and data-quality checks.
6. Add screenshot adapters and the searchable journal timeline.
7. Run an end-to-end discovery pilot and review the resulting models.

Acceptance requires every submitted input in the controlled capture test to be
accounted for with exact text, ordering, provenance, and available timestamps.
Expected visual outputs must have evidence or an explicit pending/failed state.
Mining exports must pass the agreed schema and quality checks, trace back to raw
events, and reproduce a reviewed set of workflow sequences.

## Open decisions for review

- Jira site/account and confirmation of project name and key.
- Historical chat access and actual hook support in this environment.
- Case boundaries, activity vocabulary, and handling of overlapping tasks.
- Private storage location, backup, retention, and selective publication rules.
- Screenshot triggers, viewport sizes, and supported document formats.
- Mining tool, initial discovery method, and pilot questions.

## References

- [OpenAI hooks documentation](https://learn.chatgpt.com/docs/hooks)
- [OpenAI app server documentation](https://learn.chatgpt.com/docs/app-server)
- [PM4Py event-log preparation](https://github.com/process-intelligence-solutions/pm4py/blob/release/docs/source/getting_started.rst)
- [Jira Cloud pricing](https://www.atlassian.com/software/jira/jira/pricing)

These references inform the investigation; they do not establish that capture
is installed or supported in this chat. No logger or Jira project has been set up.
