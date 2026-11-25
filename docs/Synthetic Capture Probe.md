# Synthetic Capture Probe

Status: reviewed methodology; Shari authorized a commit, push and PR on November
25, 2026. Created November 9; reorganized November 17, 2026. Not installed or
runtime-verified; exact activation setup remains pending review.

## Part 1: Purpose and methodology for human review

### What this document is for

This document proposes a small experiment to learn what conversation data we can
actually capture. It is written first for Shari to review the approach, request
changes, or approve its methodology. Technical details and operating instructions
follow so an engineer or AI can implement the reviewed approach consistently.
Reading or approving this document does not itself start collection.

The broader [Live Capture Capabilities](Live%20Capture%20Capabilities.md) plan
defines the research requirements. This experiment supports SBW-5's feasibility
investigation; SBW-6 covers broader end-to-end validation. It is an early test,
not the finished workflow-recording system.

### What we want to learn

We want to know whether the chat system sends usable notifications when you submit
a prompt, steer ongoing work, receive a completed response, interrupt work, or
compact a conversation. Compaction shortens the context available to the assistant;
our saved originals must remain independent of that context.

We will check what each notification contains, what is missing, and whether the
records connect to the right conversation and ongoing work. A completion or
compaction notification does not prove every message was captured. A long pause
does not close a research case; time between messages is not active working time.

### How the experiment would work

We would use a separate, disposable conversation containing only invented material.
A small receiving program, called the handler, would save one file whenever it
receives a notification from that test conversation. It is designed to record
quietly without changing prompts or directing the assistant.

We would compare prepared test inputs and expected activities with the saved files
and available original source records. Ordinary prompts come first, followed by
steering, interruptions, compaction and recovery scenarios. Unsupported or failed
tests would be reported as gaps rather than counted as successes.

### What would be saved and where

Each file would preserve the notification exactly as received, a unique tracking
number, a digital fingerprint for checking content integrity, and the time our
program received it. Original timestamps and other supplied fields would stay
intact. This version does not yet translate source timestamps into standard fields.

Test files would stay in a private local folder outside Git, OneDrive and other
synchronized locations. The program checks the designated conversation ID and
rejects storage inside Git. We must separately verify folder permissions and the
absence of synchronization. The program cannot recognize sensitive content:
keeping the test conversation synthetic is an operating rule. It must not be
enabled for this project conversation.

### Scope review for mixed-topic conversations

A conversation's location in an app project does not determine which research
project or case its contents belong to. One conversation may contain unrelated
activities. After authorized capture or import, review scope before process-mining
export; this rule does not authorize collecting additional conversations.

Preserve original records privately, including their text, chronology and source
identities. Assign scope through separate, revisable annotations at the message
or activity level: this research project, another project, unrelated work, or
awaiting review. Associate relevant responses and artifacts with the activity.
If one message contains several topics, reference the relevant portions without
altering the original, and leave uncertain boundaries awaiting review.

Automated classification may suggest assignments; Shari can review and correct
them. Record the affected source references, project/case assignment, inclusion
decision, reason, reviewer and review time, retaining the history of corrections.
Topic categories alone do not establish approval for inclusion in a research case.

Only records approved for a particular case enter its process-mining export.
Retain exclusion reasons and distinguish deliberately excluded activities from
missing capture. Unrelated work and elapsed gaps must not be counted as active
time on this project. Do not infer active duration from message spacing alone.
Scope approval for analysis is separate from approval to publish any content.

This is a methodology requirement, not an implemented classifier or export filter.
SBW-5 can assess whether capture preserves the evidence needed for scope review;
implementation belongs with historical intake, classification and process-mining
export work. Validate the rule using invented topic changes in the experiment;
no real unrelated conversation content is needed.

### What this test will not deliver yet

The program does not read existing transcripts, send data over a network, capture
screenshots, classify activities or import records into SQLite. It does not yet
resolve duplicate deliveries or recover every interrupted write. Production
storage and recovery remain SBW-8 prerequisites.

### Decisions and assumptions to review

| Review item | Current proposal and open question |
| --- | --- |
| Test scope | Use one designated synthetic conversation. Do Part 3's conversation scenarios—ordinary prompts, steering, completion/interruption, long pauses and compaction/restarts—cover the ways Shari works, or are any missing? Recorder reliability tests are assessed separately. |
| Evidence of success | Compare expected activities with saved records and source evidence; assess exact text, missing/duplicate events and identity continuity separately. |
| Size and timing limits | The code caps input at 5 MiB and waits up to 750 ms for input. These are provisional author-selected settings, not measured requirements or approved operational limits. Decide whether to adjust them or make them configurable before activation. |
| Privacy and setup | Review the exact folder, conversation ID, configuration and rollback before enabling the experiment. These details have not yet been prepared for approval. |
| Next decision | Produce an evidence report recommending whether to proceed, revise the approach, or record an unsupported source. One successful event does not establish complete capture. |

The 5 MiB cap limits memory use; representative payload sizes have not been
measured. The 750 ms wait was chosen to leave some room within the documented
one-second default for interruption hooks. It excludes process startup and does
not bound filesystem work, so it cannot guarantee meeting a hook deadline and
could cause avoidable gaps. Rejections and timeouts must count as capture failures.

Methodology approval would confirm the approach, not establish runtime capability
or approve an unspecified configuration. Exact setup must be reviewable before
activation. Shari has reviewed the methodology and authorized its publication
through a PR; nothing has been enabled.

## Part 2: Technical reference for implementation review

### Receipt format and persistence

The handler is `scripts/capture-probe.mjs`. It reads one JSON object from stdin
and exclusively creates a separate receipt file per invocation. Receipts contain
exact input bytes as base64, their SHA-256 hash, parsed payload, UUID, UTC receipt
time and synthetic-only marker. Base64 is encoding, not encryption. The marker
asserts intended test use; it does not verify that the content is synthetic.

The standardized source timestamp remains null; supplied source fields stay intact
in the payload for later mapping. Every invocation gets a distinct receipt identity,
even when session/turn IDs match. Distinct receipts do not prove distinct activities.

Each file is flushed before success: the handler requests that the operating system
synchronize it to storage. This does not guarantee recovery from every power or
hardware failure. It is not an exactly-once store, database importer or crash-recovery
mechanism. Incomplete files and retries require reconciliation: comparing evidence
to identify partial writes, duplicate deliveries and missing events without
inventing absent source content.

### Boundaries and failure behavior

An exact synthetic session ID and an existing output directory outside Git are
required. The handler makes no network calls, transcript reads or configuration
changes. Successful stdout/stderr are empty. Failures return code 1 with a generic
message, never code 2 or model-control instructions. Actual runtime failure
behavior remains unverified. Raw payloads must not enter diagnostics, Jira or CI.

The code enforces the provisional 5 MiB cap and 750 ms input wait. Process startup
and filesystem delays can still exceed event-specific deadlines. Generic errors
do not create a durable gap ledger: expected events, receipts and runtime errors
must be reconciled in the test report. No automatic screenshots or transcript
reconciliation are implemented.

### Configuration and trust prerequisites

Confirm local orchestration, effective managed/user/project/plugin configuration,
trust requirements, app/CLI versions and an isolated synthetic session ID. A CLI
test does not prove desktop delivery. Select one configuration layer and review
the exact definitions and handler hash. Do not collect every session through a
user-wide hook to discover the test session ID.

Resolve absolute interpreter, handler and destination paths. Verify Windows
permissions; the requested file mode alone does not establish private Windows
ACLs. The handler rejects Git paths but cannot detect every synchronized location
or enforce device encryption. Verify these separately.

The command template, after reviewing the resolved paths, is:

```text
"<absolute-node.exe>" "<absolute-capture-probe.mjs>" --synthetic "<private-synthetic-output-folder>" "<exact-synthetic-session-id>"
```

This is not an installed hook definition. Candidate events are UserPromptSubmit,
Stop, Interrupt, PreCompact and PostCompact; add tool hooks only to the isolated
experiment. Use the current official schema for the selected layer, review/trust
the exact definitions and account for event-specific deadlines. Keep delivery
synchronous until receipt behavior is measured.

### Documentation evidence

The [official Hooks guide](https://learn.chatgpt.com/docs/hooks), checked November
9, 2026, lists PreCompact/PostCompact with turn identity and manual/auto trigger
metadata, stdin JSON, empty successful output and trust requirements. These are
documented candidates, not observed desktop events. Initial investigation remains
dated November 8. This rewrite does not refresh external findings or change
runtime verification claims.

## Part 3: Execution instructions and evidence report

These steps are proposed and pending runtime execution. Repository tests use
invented inputs directly; they do not prove hook delivery or UI behavior.

1. Run `npm run check` and `npm test`. Review evidence for exact-byte preservation,
   distinct receipts, session rejection and diagnostics.
2. Resolve the provisional limits. Prepare and review the exact handler version,
   configuration, private destination, allowlisted session and rollback. Confirm
   the supported runtime and complete its normal hook trust process.
3. Submit a known multiline/Unicode prompt in the isolated conversation. Compare
   original text with received prompt fields and saved bytes with handler input
   where available. Record actual delivered fields and timestamps.
4. Submit multiple steering inputs during generation and tool execution. Test
   redirection, added constraints and cancellation requests separately. Verify
   exact text and correlation without assuming a new turn or interruption.
5. Exercise completion and interruption. Inventory visible commentary, final and
   partial responses against captured evidence. A last-message field is not a
   complete transcript.
6. Exercise supported manual/automatic compaction, then continue prompting and
   steering. Separately test restart after compaction. Compare identities,
   timestamps, missing/duplicate events and original-message retention. Assess
   compaction notification coverage separately from conversation retention.
7. Resume after a long pause: submit a synthetic prompt, leave the conversation
   idle for 10 hours or longer, then return and continue. Verify earlier records
   remain available and new inputs are captured and correlated to the same
   conversation and research case. The pause must not automatically close the
   case. Record the elapsed gap without treating it as active working time.
   Test returning to an open conversation separately from reopening it after an
   app restart; record any continuity gaps. SBW-5 assesses capture feasibility;
   durable storage and recovery remain SBW-8 responsibilities.
8. Test concurrent receipts, malformed/oversized input, unwritable storage and
   timeout behavior. Compare expected events with evidence, recording incomplete
   writes, duplicates and gaps. Unsupported scenarios remain unverified.
9. Use invented activities from two projects and an unrelated topic within the
   synthetic conversation, including one mixed-topic message. Review their scope
   and associated responses/artifacts, leave an ambiguous assignment pending,
   and correct an earlier assignment. Manually demonstrate a case-specific export
   selection containing only approved records, with exclusion reasons and revision
   history preserved separately from unchanged originals. Check that unrelated
   activity is not counted as active case time. This is a methodology walkthrough;
   it does not establish an implemented classifier or production export filter.
10. Disable the exact experimental definitions and restore prior configuration.
   Verify a final synthetic prompt produces no more receipts. Record rollback;
   retain private evidence until reviewed and publish only approved findings.

Report each scenario's synthetic input ID, runtime/handler version, expected and
observed behavior, received fields, receipt IDs, timestamp availability, correlation
result, coverage status, gap reason and private evidence reference. Separate
observations from interpretations and proposed fixes.

The deliverable is an evidence report supporting the next design decision, not a
blanket completeness claim. SBW-5 records feasibility and limitations; SBW-6
validates the broader workflow. No real research data has been captured by this
probe. Methodology review does not establish runtime capability or authorize an
unspecified activation configuration.
