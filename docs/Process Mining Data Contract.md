# Process Mining Data Contract

Status: approved specification, version 0.1. Approved November 2, 2026 for SBW-7.
This specification is not an installed logger or a validated capture capability.

## Purpose and boundaries

Define the private research records before implementing collection. The local
SQLite database is authoritative; raw prompts and artifact files stay outside
Git and synchronized folders. This public document contains schema decisions
and synthetic examples only. See [Data Security Policy](Data%20Security%20Policy.md).

## Cases and relationships

A case is a bounded task with a stated outcome and acceptance criterion, such as
"Revise the homepage introduction." A chat, turn, Jira issue, or project is not
automatically a case. A case may span chats; a chat may contain multiple cases.

- Create an immutable case ID when an outcome is identified. Mark its assignment
  provisional until reviewed; unassigned events remain in the journal.
- Start a case at its first observed relevant event. Record whether earlier work
  is missing; this is an observed boundary, not proof of the actual beginning.
- Complete a case when its acceptance criterion is explicitly met or approved.
  A stopped assistant turn alone does not complete a case.
- Cancellation is a separate terminal outcome. Reopening adds a new state event
  to the same case when pursuing the same outcome; a materially different outcome
  receives a new case linked to its predecessor.
- Overlapping tasks keep separate IDs. An event may relate to several cases;
  derived conventional mining logs require a reviewed primary case or an explicit
  duplication policy. Never silently duplicate an event across traces.
- Reassignments and manual corrections append dated decisions with reasons;
  they do not overwrite the original observation.

Preserve many-to-many event/case/artifact relationships.

Jira tracks implementation work for this project. Research records have their own
permanent identifiers and do not depend on Jira. When useful, a record may include
an optional link to a related Jira task.

## Minimum event record

Use application-generated UUIDs for internal identities. Do not derive them from
prompt text. Required means a value must exist unless nullability is stated.

| Field | Type and rule |
| --- | --- |
| event_id | UUID, immutable and unique |
| schema_version | String, initially 0.1 |
| source | Adapter name, version, and capture method |
| source_event_id | Nullable provider identity; retain for deduplication |
| occurred_at | Nullable RFC 3339 UTC source timestamp |
| recorded_at | Required RFC 3339 UTC receipt/import timestamp |
| time_quality | source, estimated, or unknown; estimates include method |
| sequence | Monotonic local ingestion integer; not a global causal order |
| actor_type | user, assistant, tool, or system |
| actor_id | Nullable private pseudonymous identifier |
| activity | Controlled label; unknown remains explicit |
| lifecycle | atomic, start, complete, or interrupt |
| operation_id | Required for paired lifecycle events; otherwise nullable |
| outcome | success, failure, cancelled, pending, or unknown |
| chat_id, turn_id | Nullable source identifiers; never fabricate |
| parent_event_id | Nullable observed causal link, distinct from time order |
| raw_record_id | Reference to exact private payload or capture record |

Case assignments, category assignments, artifacts, and tracking references use
linked records so later corrections do not change the raw event. Unavailable
source metadata must have an explicit missing reason rather than an invented ID.

## Exact inputs, time, and delivery

Preserve full submitted text and line breaks in a private raw record. Distinguish
human-authored text from automatic UI context and tool output. Capture submissions,
not unsent typing. Store originals before deriving normalized text or categories.
Protect source payloads as private data; do not copy credentials into diagnostics.

Store timestamps in UTC and display America/Chicago with the applicable offset.
Retain original source timestamp text and precision. Unknown historical event
times remain null; import time must not masquerade as the original event time.
Two equal timestamps do not establish order. Sequence describes receipt order;
source order and explicit causal links are separate evidence.

Persist raw events transactionally with serialized SQLite writes. Deduplicate
re-delivery using source identity and adapter scope when available. Identical text
alone is insufficient: a user may intentionally submit the same prompt twice.
Without reliable identity, flag suspected duplicates for review. Record capture
gaps, failures, retries, and recovery explicitly; do not promise exact-once delivery.

## Activities and classifications

Initial activities: Submit request, Provide response, Generate artifact,
Run validation, Review artifact, Record decision, Commit change, Push change,
Merge change, Capture evidence, and Unknown. A revision request is Submit request
with revision intent. Only record tool/Git activity supported by observed evidence.
Changing Jira status is a tracking event, not proof that the underlying work ran.

Categories are separate, multi-valued annotations:

- Intent: request, revision, correction, question, decision, feedback.
- Work area: design, content, code, Git, testing, documentation, planning.
- Output: website, document, image, repository, other.

Each annotation records taxonomy/classifier version, method, recorded time,
uncertainty, and superseded annotation ID when corrected. Keep human-reviewed
labels distinguishable from automated inference. Raw capture must not wait for
classification. Historical classifications are explicitly inferred.

## Evidence records

Each artifact has an internal ID, media type, private relative path, byte hash,
version reference, and producing event links. Hashes support integrity and
deduplication; they do not establish ownership or authenticity by themselves.
Never put absolute private filesystem paths in public exports.

Screenshot records add capture time, URL or document reference, viewport size or
page number, artifact version/commit SHA, and pending/success/failure/unavailable
state with reason. A screenshot captured later cannot stand in for an earlier
state. GitHub evidence follows a push/merge; local-only changes use local version
references until a browser capture is possible.

## Mining export contract

Generate versioned private CSV and XES datasets from reviewed assignments.
CSV core columns: case_id, activity, timestamp, event_id. Map XES case identity
to trace concept:name, activity to event concept:name, and timestamp to
time:timestamp. Lifecycle exports must state their mapping and pairing rules.

Each export includes a manifest with contract/taxonomy/transform versions,
selection criteria, source event IDs, ordering and lifecycle policy, timestamp
policy, counts, exclusions with reasons, and a checksum. Derived JSONL is an
export, not a second authoritative journal. Public release is a separate reviewed
selection, never an automatic database dump.

Exclude unresolved case assignments or unknown event times from discovery logs
that require those fields, while retaining them in the journal and exclusion
report. Estimated-time datasets must be separately identified. Do not synthesize
completion events. Report unmatched starts, interruptions, and capture gaps.

## Review and acceptance

Before implementing the logger, exercise synthetic fixtures covering: a complete
case; multiple cases in one chat; one case across chats; repeated identical
submissions; re-delivery; interruption without completion; reopening; unknown
historical time; equal/out-of-order times; and a failed screenshot.

Acceptance requires stable IDs, retained originals, traceable corrections,
deterministic exports, explicit exclusions, and no raw/private data in public
outputs. Verify the selected mining tool's import mapping during the export task.
This specification does not claim those implementation tests have passed.

Shari approved the contract, including the case-boundary rules and initial
activity vocabulary. Confirm adapter metadata through SBW-4/SBW-5; select private
storage, backup, and retention settings before collection in SBW-8; verify mining
tool mappings and lifecycle export policy in SBW-10. These are implementation
follow-ups, not evidence that the documented contract is already enforced.

## SBW-7 acceptance review

The ticket defines a specification deliverable, completed before the logger.
Each requirement is covered below; automated capture and export behavior belong
to the later implementation tasks.

| Ticket requirement | Contract coverage |
| --- | --- |
| Event IDs, cases, activities, actors | Cases and relationships; Minimum event record; Activities and classifications |
| Source/capture time and ordering | Exact inputs, time, and delivery; nullable source time and separate receipt sequence |
| Lifecycle correlation | lifecycle, operation_id, outcome; no synthesized completion |
| Categories, provenance, schema versions | Minimum event record; versioned annotation history |
| Artifact links | Evidence records; many-to-many producing-event links |
| Start, end, cancellation, reopening, overlap | Cases and relationships; explicit observed boundaries and assignment policy |
| Raw-text privacy and uncertain assignments | Purpose and boundaries; Exact inputs; exclusion reports |
| Finish before logger implementation | Specification approved; logger not installed |

### Synthetic walkthroughs and expected outcomes

These are design-level examples, not captured user data or executed software tests.

| Scenario | Expected application of the contract |
| --- | --- |
| Request, artifact, explicit acceptance | Three observed events relate to one case; acceptance completes it |
| Two tasks in one chat | Separate case IDs; ambiguous assignments stay provisional |
| One task across two chats | Same case ID with distinct source chat IDs |
| Same text submitted twice | Two events when source submission identities differ |
| One source event delivered twice | One raw event identity after scoped deduplication |
| Start then interruption | Correlate with operation_id; report unmatched completion without inventing one |
| Accepted outcome reopened | Append reopening state to the same case when its outcome is unchanged |
| Historical message without time | Keep text and import time; exclude from time-required mining export with reason |
| Equal or out-of-order timestamps | Retain source times and receipt sequence; do not infer causality from ties |
| Failed screenshot | Retain failure reason and producing-event link; retry as a separate capture attempt |
| Corrected case/category assignment | Append a superseding decision/annotation; preserve raw original |

Review outcome: the documented requirements of SBW-7 are satisfied. Actual
durability, exact capture, deduplication, privacy enforcement, and deterministic
exports must still be tested in SBW-6/SBW-8/SBW-9/SBW-10 before operational claims.
