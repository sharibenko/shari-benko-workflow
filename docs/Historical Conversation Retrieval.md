# Historical Conversation Retrieval

Status: investigation draft for Shari's review. November 5, 2026. Jira: SBW-4.
Based on the approved [data contract](Process%20Mining%20Data%20Contract.md).
This document contains capability findings and an import design, not raw chats.

## Finding

The first submitted input in this project's current chat is retrievable from
the local Codex transcript. The app history reader also reaches that input by
paging to the oldest turn. This establishes access for this chat, not universal
coverage for every ChatGPT conversation, device or deleted chat.

A read-only inspection found message text, source message identities, turn
references and source creation times in the local transcript. No database import,
private archive, capture integration or public upload of raw data was performed.
The original transcript remains in the application's existing storage.

## Evidence and access methods

| Method | Evidence on November 5 | Use and limitation |
| --- | --- | --- |
| App history reader | Six cursor pages reached the oldest turn; 58 turns were returned in newest-first order | Useful for discovery and cross-checking. User/assistant items are available, but the returned message items inspected did not expose individual creation times. Turn start/completion times must not substitute for message times. Output limits and omitted tool results prevent treating this as a lossless archive. |
| Local Codex transcript | A matching JSONL transcript was located for this chat; all lines parsed in the inspected read | Best observed candidate for a private historical importer. This is an application-owned format, not a verified stable public schema; pin and validate a parser against each supported version. |
| Documented conversation path command | Official desktop documentation lists Copy conversation path for Codex, including Windows | Prefer the app's path command for locating future chat transcripts rather than assuming every installation uses the same directory. The command itself was not exercised in this investigation. |
| Documented Markdown export | Official developer-command documentation describes `/export` after a turn finishes | A candidate readable export, not tested here. Verify availability in the actual surface and inspect its metadata before choosing it; documentation does not establish per-message timestamp or attachment completeness for this desktop chat. |
| Existing artifacts | Project screenshots and generated-image files were observed in the existing local artifact locations during this work | Recover only files still present and attributable to an event/version. A reference is not proof the file still exists or that all earlier artifacts were retained. |

The app reader and local transcript independently exposed the initial prompt as
a 381-character text item. The local record included a source creation time and
turn reference. This is evidence of the opening input's availability; it is not
a byte-for-byte certification of every historical message or artifact.

## Observed local record structure

The inspected JSONL envelopes contain `timestamp`, `ordinal`, `type` and `payload`.
Relevant record families include `session_meta`, `response_item`, `event_msg`,
`turn_context` and `compacted`. Preserve all original bytes privately before
interpreting them; a parser must retain unfamiliar records and report them.

For `response_item` message records:

- `payload.role` distinguishes user, assistant and other roles.
- `payload.id` provides a source message identity.
- `payload.content` is an ordered array of typed blocks, including `input_text`
  and `output_text`; never assume every block is text.
- `payload.internal_chat_message_metadata_passthrough` contained `turn_id` and
  `create_time` in the inspected user and assistant records. These internal fields
  are observations, not a supported API contract.
- Assistant `phase` can distinguish commentary and final output where present.

All 69 user-role and 118 assistant-role message records inspected had an ID,
metadata turn reference and numeric source creation time. These are record counts,
not counts of human submissions: user-role records also include automatic context.
Counts describe one inspection of an active transcript and will change with use.

The transcript also contains completed-item representations of user messages,
assistant messages, commands, tool calls, file changes and other activity. Do not
import both those representations and response messages as independent events
without a tested identity/correlation rule. Three compaction records were present;
their presence requires coverage checking, not an assumption that earlier text
was either lost or preserved in full.

## Contract mapping and chronology

| Contract requirement | Proposed mapping and rule |
| --- | --- |
| Raw record | Retain the immutable source snapshot, file hash, byte/line position and untouched payload; link derived events to it |
| Internal identities | Generate research UUIDs; preserve source message and turn IDs separately |
| Source event identity | Adapter scope plus observed message identity; define explicit correlation with completed-item copies |
| Actor and activity | Map user/assistant roles only after distinguishing human input from injected context; tool/Git events require their own observed evidence |
| Source time | Use message metadata `create_time` where valid; retain the original numeric representation and conversion precision |
| Other timestamps | Preserve envelope time and turn start/completion as distinct fields; never silently substitute them for message submission or response time |
| Import time | Set `recorded_at` when the importer accepts the record, independently of source time |
| Ordering | Preserve file position, ordinal, source time and observed causal references separately. Reverse newest-first app pages for browsing, not as proof of global causal order |
| Lifecycle | Use observed start, completion or interruption records with validated pairing; a response or stopped turn does not imply case completion |
| Cases/categories | Add provisional, versioned annotations after capture; a whole chat is not automatically one case |
| Artifacts | Link surviving files by IDs, hashes and observed versions; preserve unavailable status with reason |
| Missing values | Keep unknown times and unavailable IDs explicit; exclude unresolved records from mining exports that require them |

Convert valid source times to UTC while retaining the original value and precision;
display local times using America/Chicago's applicable offset. A turn can include
multiple user inputs and responses. Assigning every message the turn start time
would create false simultaneity and misleading process durations.

For exact inputs, retain the complete source record and ordered text blocks,
including whitespace and line breaks. Derive human-authored text separately from
automatic browser context, environment messages and tool output. Parse recognized
wrappers conservatively; ambiguous material stays flagged for review. Never
reconstruct missing originals from summaries, compaction text or assistant memory.

## Historical artifacts and coverage gaps

An artifact inventory must check each source reference against a surviving file,
record its hash and media type, and distinguish original output from later edits,
annotations and screenshots. Generated previews are not substitutes for originals.
Remote links may expire; retrieval and any credential requirements need validation.

A screenshot taken today proves today's displayed state. It cannot stand in for
a screenshot of an earlier state. Missing historical screenshots remain missing.
Git history may provide a version for a separately labeled reconstruction, but
that is new evidence with its own capture time and method.

Remaining limits:

- This investigation did not certify every message against the UI, every branch
  or retry, attachment-byte completeness, or all tool output against originals.
- Per-message source timestamps are available in this inspected local source;
  their availability in other exports and chats remains unverified.
- Deleted or unavailable source data cannot be promised recoverable. No other
  project's conversations were inspected.
- The active file changes while work continues. A reproducible import needs a
  consistent snapshot and recorded cutoff, not repeated reads of a growing file.
- App format changes, duplicate representations, context injection and compaction
  require explicit compatibility and coverage reports before mining use.

## Proposed import procedure

1. Complete SBW-8's private storage, encryption, retention and backup prerequisites.
   Keep raw archives outside Git and synchronized folders.
2. Locate the selected conversation through supported app facilities; record
   source identity, application/parser version, scope and acquisition method privately.
3. After the relevant turn finishes, create a consistent private snapshot. Record
   its checksum, acquisition time and cutoff; do not alter the application file.
4. Validate the schema and preserve unknown records. Inventory message identities,
   ordered content, source times, branches, interruptions and artifact references.
5. Apply tested duplicate/correlation and human-input separation rules. Import raw
   records transactionally; append derived events and annotations with provenance.
6. Reconcile the opening input, sampled multiline/follow-up inputs and final output
   against the UI. Report counts, missing records, ambiguous duplicates, unknown
   times and unavailable artifacts without exposing text in diagnostics.
7. Release reviewed cases to the mining preparation task only when required fields
   meet the data contract. Preserve excluded records in the private journal.

Test the importer with synthetic fixtures before running it on research data:
multiline text, automatic context, equal/unknown times, repeated identical prompts,
completed-item copies, interruption, compaction, missing files and unknown schema.
Importer implementation and operational validation remain future work.

## SBW-4 acceptance review

| Ticket requirement | Evidence and current disposition |
| --- | --- |
| Determine access from the first input | Opening input found in app history and local transcript; satisfied for this chat |
| Original ordering and timestamps | Source message times and ordering metadata observed; import rules documented, full reconciliation still required |
| Keep unknown times unknown | Contract mapping forbids replacing unknown times with import or turn time |
| Do not reconstruct text from summaries | Originals-only rule and compaction caveat documented |
| Document provenance, gaps and historical artifacts | Access matrix, raw snapshot requirements, artifact inventory procedure and explicit limits above |

The investigation is ready for review. It establishes a feasible candidate and
its limitations; it does not claim a completed importer or a complete private
archive. SBW-5/SBW-6 investigate and prove new-work capture independently.

## Official documentation consulted

Accessed November 5, 2026. Documentation supports the product commands below;
local schema findings above come from read-only observation, not those pages.

- [Desktop commands: conversation path and chat search](https://learn.chatgpt.com/docs/app/commands)
- [Developer commands: Markdown conversation export](https://learn.chatgpt.com/docs/developer-commands)
- [Configuration reference: history persistence and size limits](https://learn.chatgpt.com/docs/config-file/config-reference)

History persistence settings do not establish that a particular history file is a
complete archive. No configuration or retention setting was changed here.
