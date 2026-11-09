# Live Capture Capabilities

Status: investigation plan reviewed and approved by Shari on November 9, 2026.
Initial evidence collected November 8, 2026. Jira: SBW-5 In Progress.
This is a capability assessment and proof plan, not an installed capture system.

## Current evidence

The discovered local CLI reports `codex-cli 0.166.0-alpha.6` and `hooks` as stable
and enabled. These read-only checks completed with temporary-directory permission
warnings. They do not prove that this desktop chat invokes a configured handler.

No hook definitions were found in the inspected user config's hook sections or
the checked user/workspace/repository hook files. This limited inspection does
not certify all managed, plugin or effective runtime configuration. No settings,
trust decisions or permissions were changed; no handler was installed or run.

SBW-4 already established a local transcript candidate for this chat. Historical
records are useful reconciliation evidence, not proof that live hooks deliver.
See [Historical Conversation Retrieval](Historical%20Conversation%20Retrieval.md).

## Documented candidate interfaces

The [official Hooks guide](https://learn.chatgpt.com/docs/hooks), accessed November
8, documents the following. Every row remains unverified in this desktop runtime.

| Event/path | Relevant documented payload or boundary |
| --- | --- |
| `UserPromptSubmit` | `prompt`, `turn_id`: candidate submitted-text capture |
| `Stop` | `turn_id`, `stop_hook_active`, nullable `last_assistant_message`: latest response, not a complete transcript |
| `Interrupt` | Main-thread interruption and `turn_id`; default one-second timeout, maximum three seconds |
| `PreToolUse` / `PostToolUse` | `tool_name`, `tool_use_id`, `tool_input`; hosted search excluded and specialized paths can bypass hooks |
| `PreModelRequest` / `PostModelRequest` | Per-attempt diagnostics; outcome is not full assistant response text |
| Common metadata | Session identity, nullable transcript path, working directory and event name; validate event-specific fields |

Local definitions support command/MCP handlers and require trust review.
Cloud orchestration has different restrictions; local tool execution alone does
not establish local-hook availability. Transcript format is unstable. Concurrent
handlers and background cancellation require explicit loss/ordering tests.

## Investigation matrix

| Research need | Candidate and present evidence | Gate before operational use |
| --- | --- | --- |
| Exact human submission | Prompt hook; documented only | Compare synthetic source text including line breaks, Unicode, whitespace and automatic context against the received payload |
| Mid-turn steering inputs | Prompt hook and transcript reconciliation are candidates; delivery and event semantics remain unverified | Capture every steering submission separately with exact text, available source timestamp and receipt time; verify its relationship to ongoing work without assuming a new turn or an interruption |
| Conversation compaction and capture continuity | Source records and any exposed compaction signals are candidates; detection and continuity remain unverified | Assess notification coverage separately from exact-message retention, identity continuity and missing/duplicate events across compaction |
| Every assistant message | Stop's latest-message field plus source reconciliation | Verify commentary, final, multiple messages, missing text and interrupted partial output; do not treat latest text as all responses |
| Original message timestamps | Source metadata where available; otherwise receipt time | Inspect actual payloads; common documentation does not establish a submission timestamp. Unknown source time remains null |
| Message and turn identity | Documented session/turn fields; message IDs not established for each hook | Verify correlation across follow-ups, concurrent turns/chats, retries and continuations; never fabricate provider IDs |
| Completion | Stop candidate | Determine when it fires and whether repeated invocations represent continuation; stopped turn does not complete a research case |
| Interruption | Interrupt candidate | Test active-turn interruption, partial output, handler timeout and abrupt shutdown; no guaranteed crash notification assumed |
| Tool operations | Pre/post candidates | Verify shell, patch, MCP and code-mode nested calls; distinguish invocation, output and observed success/failure |
| Full tool output | Not established by listed input fields | Inspect runtime payloads; reconcile with source evidence only when available. A post-hook does not prove output completeness |
| Git and screenshots | Tool evidence plus dedicated version/artifact capture | A command invocation does not prove a commit/push/merge succeeded; capture verified outcomes and screenshots under SBW-9 |
| Durable, complete delivery | No project capture evidence yet | Prove persistence, failure reporting, retry and reconciliation; do not promise exactly-once delivery |

## Proposed approach for SBW-6

Proceed with a narrowly scoped local-hook feasibility probe, conditional on
confirming that both orchestration and execution for the test chat are local.
Use synthetic prompts in a disposable test context first. Read-only CLI feature
discovery supports investigating this path, not deploying it to all chats.

Use a passive handler that acknowledges events without blocking or rewriting
prompts/tools or continuing turns. Preserve received payloads in private storage
before asynchronous classification. Serialize research writes, assign internal
UUIDs, record receipt times, and retain source timestamps only when supported.
Keep the capture path short; analysis and screenshots run after durable receipt.

Record a distinct hook-invocation receipt identity and correlate it to source
session/turn/tool identities. Turn ID alone cannot deduplicate multiple submissions
or stop invocations. Reconcile overlapping hooks and transcript evidence through
the SBW-14 identity rules rather than creating independent duplicate events.

Mid-turn steering inputs are an explicit capture requirement: a person can submit
an instruction while the assistant is still working. Preserve each submission's
full text and distinct identity, available source timestamp and receipt time, and
evidence linking it to the ongoing turn and research case. Unknown source times
remain null. Several submissions may belong to one turn; turn ID alone cannot
identify them. Do not assume steering fires `UserPromptSubmit`, starts a new turn,
or produces an `Interrupt` event. Establish those behaviors through runtime tests
and reconcile against source records where available; report any coverage gaps.

Classify whether a steering input redirects work, adds a constraint or requests
cancellation through separate, versioned annotations. Preserve the original text
and distinguish the person's request from the observed effect on execution.

Preserve original events in private storage independently of the assistant's
current context. Conversation compaction must never overwrite those records.
When a source exposes compaction, preserve its source identity when available,
source timestamp when available, receipt time, and evidence linking it to the
conversation. Unknown source fields remain null; assign a separate internal
record identity. Keep any available summary as a derived record with provenance,
never as a replacement for original messages or proof of exact historical text.

Evaluate compaction detection separately from capture continuity. Capture may
remain complete without an explicit notification, while a notification alone
does not establish that earlier messages were retained. Reconcile against original
source records where available and report gaps rather than reconstructing text
from a summary. Compaction does not itself start or complete a research case.

Treat Stop as a completion/last-message signal. If the pilot shows that intermediate
or interrupted response text is absent, add a version-tested transcript adapter or
another supported event interface. Preserve the source and report the gap; never
reconstruct missing text from a summary. Do not assume an alternative surface's
API can retrieve this desktop chat.

For cloud-orchestrated environments, verify the available managed integration and
its data destination separately. Do not transmit research payloads to a new MCP
service as a workaround. An unsupported source remains explicitly unverified.

## Configuration and permission prerequisites

Before installing the probe, inventory effective hook sources, management policy,
trust state, application version and orchestration mode. Select one config layer
for the experiment and record its exact definition/version and rollback procedure.
Resolve interpreter and handler paths explicitly on Windows; account for spaces
and the session working directory. Do not place raw capture files in the public
repository or this synchronized workspace.

Trusting a handler grants it access to the event payload; review the exact handler
and destination before enabling it. No bypass of hook trust or managed policy is
part of this plan. Keep logging passive, local and scoped to the chosen project.
Do not echo payloads into stdout/stderr, tool diagnostics, public CI or Jira.

Production research capture requires SBW-8's storage, encryption, retention and
backup decisions. A synthetic-only probe can precede those operational storage
steps, but it must not silently become collection of real research conversations.

## Test and evidence plan

These tests are pending, not passed. Keep the matrix with the actual runtime
version, synthetic input ID, expected observation, received fields, timestamps,
correlation result, failure/gap reason and private evidence reference.

| Scenario | Evidence required |
| --- | --- |
| Multiline, Unicode and whitespace | Exact received text versus original; recognized context kept separate |
| Follow-up after a completed response | Each submission represented and correlated to its turn and case |
| Mid-turn steering inputs | Compare exact synthetic text with captured records; test multiple inputs during generation and tool execution, including redirection, added constraints and cancellation requests. Record available timestamps, identities, ordering evidence, actual hook events and observed effects; reconcile with source records and report gaps without assuming one prompt per turn or that steering interrupts work |
| Compaction and continued interaction | Run a synthetic conversation through compaction, then continue prompting and steering. Compare original source text and captured records before/after for exact text, missing/duplicate events, identity continuity and timestamp coverage; document whether a compaction signal and earlier original messages are exposed |
| Restart after compaction | Separately restart the test context after compaction and verify retained originals, correlation and resumed capture; document unrecoverable gaps and avoid re-importing summaries as original messages |
| Commentary and final response | Inventory all visible outputs; determine what Stop actually supplies |
| Active interruption | Observed interruption plus partial-output coverage; no synthesized completion |
| Retry or continued turn | Attempt/continuation identity and duplicate policy; no new human submission inferred |
| Concurrent operations/chats | Independent correlation and durable writes despite reordered delivery |
| Shell/tool success and failure | Verified pre/post fields and outcome, including non-zero shell exit |
| Handler failure or timeout | Visible capture gap, bounded latency, recoverable state and no raw data leakage |
| Restart or abrupt close | Determine which events survive and reconcile gaps; no assumed shutdown delivery |
| Unsupported tool/source | Explicit coverage exclusion rather than a completeness claim |

SBW-5 records the capability findings and limitations; SBW-6 performs the end-to-end
desktop proof. Test results needed to settle SBW-5's runtime questions must be
linked back here. Do not mark hooks runtime-verified based on documentation alone.

## Current recommendation and acceptance status

Local prompt, Stop, Interrupt and supported tool hooks are candidates for SBW-6.
Mid-turn steering coverage, compaction detection and continuity, full-response
coverage, source timestamps, effective desktop hook configuration, delivery/retry
behavior and failure recovery remain unverified. Hosted-tool
coverage and other orchestration modes require separate evidence or explicit gaps.

Shari approved this capability assessment and investigation plan, including the
steering and compaction requirements, on November 9, 2026. This records document
review approval, not verified capture capability or approval of an unreviewed
handler/configuration. SBW-5 remains In Progress pending runtime feasibility
evidence. SBW-5 documents compaction signals and limitations; SBW-6 validates
end-to-end continuity.
No hook delivery, synthetic runtime scenario or operational logging is claimed
tested by the repository's ordinary documentation checks.

Related: [Data Contract](Process%20Mining%20Data%20Contract.md),
[Project Architecture](Project%20Architecture.md),
[Data Security Policy](Data%20Security%20Policy.md).
