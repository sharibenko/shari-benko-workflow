# Project Architecture

Status: approved by Shari for publication. November 3, 2026. Jira: SBW-12.
The data contract was approved under SBW-7. This document describes the intended
system and its boundaries; the capture and analysis pipeline is not installed.

## Architecture at a glance

The project separates research tools, private research data, and public results.
Code in the private repository runs locally against private storage. Selected
results enter the public repository only after Shari reviews and approves them.
Jira tracks the work of building this system.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"Arial, Helvetica, sans-serif","primaryColor":"#ffffff","primaryTextColor":"#18252e","primaryBorderColor":"#52666e","lineColor":"#52666e","clusterBkg":"#faf9f6","clusterBorder":"#c7d0d3","edgeLabelBackground":"#faf9f6"}}}%%
flowchart TB
  sources["Sources: live chats, Git activity, generated artifacts"]
  history["Historical chat exports and existing project evidence"]

  subgraph repo["Private research repository — planned"]
    code["Versioned capture, import, analysis and export code"]
  end

  subgraph local["Private local workspace — planned"]
    capture["Local capture and import adapters"]
    db[("SQLite: raw events, provenance and relationships")]
    files["Private artifact files: screenshots, documents and images"]
    transform["Normalize, correlate cases, classify and validate"]
    exports["Versioned mining exports and quality reports"]
    analysis["Workflow models and private journal"]
    candidate["Selected publication candidates"]
    review{"Shari reviews and explicitly approves release"}
    capture -->|"Exact inputs and available source metadata"| db
    capture -->|"Original files and visual captures"| files
    files -->|"Artifact IDs, hashes and version references"| db
    db -->|"Read preserved originals and linked records"| transform
    transform -->|"Append derived annotations and corrections"| db
    transform -->|"Reviewed cases; exclusions reported"| exports
    exports -->|"CSV or XES and provenance manifest"| analysis
    db -->|"Local timeline records"| analysis
    files -->|"Linked evidence for local viewing"| analysis
    analysis -->|"Select findings, models and examples"| candidate
    candidate -->|"Inspect text, images and embedded data"| review
    review -->|"If revisions are needed: revise candidate"| candidate
    withheld["Withheld release: stays private"]
    review -->|"If release is withheld"| withheld
  end

  code -.->|"Run locally; code is not the data store"| capture
  code -.->|"Run analysis and export logic locally"| transform
  sources -->|"Observable activity only"| capture
  history -->|"If historical evidence is imported: retain gaps and unknown times"| capture

  subgraph backups["Private backups — planned"]
    backup["Encrypted backup on separate physical storage — device and schedule TBD"]
    offsite["Optional backup encrypted before cloud upload"]
    backup -.->|"Optional: encrypted cloud copy if separately selected"| offsite
  end
  db -->|"Consistent database snapshot"| backup
  files -->|"Matching artifact versions"| backup

  subgraph public["Public repository — exists; publication pipeline planned"]
    approved["Approved release files and public presentation code — planned"]
    ci["PR review and CI checks"]
    html["Public HTML page, models, examples and insights — planned"]
    approved -->|"Branch and pull request"| ci
    ci -->|"Merge; future build and deployment"| html
  end
  review -->|"If explicitly approved: only approved files cross this boundary"| approved

  jira["Jira: implementation tasks and decisions; already set up"]
  jira -.->|"Optional task references; independent research IDs"| db

  %% Edge indices follow arrow declaration order; update when adding flows.
  %% Code execution and optional Jira references: thin gray dotted arrows.
  linkStyle 13,14,23 stroke:#52666e,stroke-width:1px,stroke-dasharray:2 4;
  %% Optional cloud capability: dashed arrow, also explicitly labeled Optional.
  linkStyle 17 stroke:#8a6200,stroke-width:2px,stroke-dasharray:8 5;
  %% Approved publication path: green accent; approval remains mandatory.
  linkStyle 20,21,22 stroke:#23865a,stroke-width:2px;
  classDef neutral fill:#ffffff,stroke:#52666e,color:#18252e;
  classDef publication fill:#e4f4ec,stroke:#23865a,color:#18252e;
  class sources,history,code,capture,db,files,transform,exports,analysis,candidate,review,withheld,backup,offsite,jira neutral;
  class approved,ci,html publication;
```

### Diagram legend

| Treatment | Meaning |
| --- | --- |
| Solid arrow | Core data or release flow in the chosen architecture |
| Dashed arrow labeled Optional | Optional capability; the cloud copy requires a separate decision |
| Arrow labeled If | Conditional action, including historical import and publication-review outcomes |
| Thin gray dotted arrow | Code execution or reference relationship; Jira references are explicitly optional |
| Green publication path | Approved-output flow; explicit approval is required for every public release |
| Planned / exists text | Implementation state, independent of whether a flow is core or optional |

Labels carry the meaning alongside line style and color. Conditional actions use
solid arrows: they are followed only when their stated condition applies. The
physical backup is a core requirement; only the additional cloud copy is optional.
Withholding ends that release path privately; revising returns to the candidate.
The public repository and Jira exist; the capture, backup and publication pipelines
remain planned. Green does not mean a component is already implemented.

## Components and ownership of responsibilities

| Component | Responsibility | Current state |
| --- | --- | --- |
| Source systems | Hold original chats, Git history and design outputs | Existing evidence may be available; access and coverage unverified |
| Private research repository | Version capture adapters, transformations, analysis code and unpublished research documentation | Planned; name and location undecided |
| Local private workspace | Run tools; hold database, artifacts, mining datasets and candidate releases | Planned; choose a location outside Git and synchronized folders |
| Local SQLite database | Authoritative append-only raw event journal, provenance, relationships and versioned annotations | Planned |
| Local artifact folder | Original files and captures linked by stable artifact IDs and versions | Planned |
| Mining pipeline and journal | Produce reproducible datasets, quality reports, models and private chronological browsing | Planned |
| Publication review | Shari selects and approves exactly what may be public | Policy established; enforcement tooling planned |
| Public repository | Store approved public documentation, results and presentation code | Exists: sharibenko/shari-benko-workflow |
| Public HTML presentation | Explain the design process, evidence, limitations and practical improvements | Planned; hosting and deployment undecided |
| Jira | Track implementation tasks, decisions and acceptance | Exists: Shari Benko Workflow, key SBW |
| Private backups | Restore a consistent database and its linked files | Planned; destination, schedule and key handling undecided |

Raw conversations and working datasets stay outside both repositories. A private
repository controls access to its code and documents; it is not the database.
The public repository may contain this architecture and other approved planning
documents. Future internal research planning belongs in the private repository.

## Capture and historical imports

For new work, integrations will capture submitted prompts, responses and other
workflow events where the tool provides supported access. We will verify the
available capture methods and document any gaps before implementation. SBW-5
investigates supported access and available fields; SBW-6 proves capture and
delivery behavior. Capture failures and unavailable evidence remain visible.
Public GitHub actions are captured after push or merge; local Git changes retain
local version references until a corresponding browser view exists.

Historical imports use the same event and evidence structure. Preserve exact text,
original timestamps and ordering where retrievable. Unknown source times stay
unknown; receipt/import time is stored separately. Mark inferred classifications,
case assignments and incomplete project coverage. A new screenshot cannot replace
a missing historical screenshot. SBW-4 determines retrieval feasibility.

Source services may already hold original copies. Local storage does not delete
those copies. Any later external model-assisted classification requires a separate
decision about provider access and the exact data transmitted; the initial
architecture assumes local processing and rule-based classification.

## Storage, transformation and mining

Capture writes originals transactionally to SQLite with serialized writes and
scoped deduplication. Files live separately, with database references to IDs,
hashes and versions. Classification runs after durable capture; corrections append
new annotations without changing original observations.

Normalization, case correlation, classification and quality validation produce
versioned mining exports. Export manifests retain source event IDs, transformation
versions, inclusion rules and explicit exclusions. CSV/XES and derived JSONL are
outputs from the database, not competing authoritative journals.

Private models and the journal link back to source events and evidence. Comparison
with a completed project records differences in context and evidence coverage.
Shared patterns remain hypotheses for further study. The exact mining tool and
discovery method remain open decisions.

## Publication boundary

1. Select candidate findings, models and example images into a private staging area.
2. Inspect text, screenshots, metadata, embedded data, identifiers and confidential
   material. Create redacted derivatives where needed, retaining originals privately.
3. Record Shari's explicit approval against an exact release manifest: file list,
   versions/hashes, review date and approval reference. Changing approved files
   requires review of the changed release. Keep any sensitive review notes private.
4. Copy only that approved file set into a public feature branch. Do not connect
   the public build to SQLite, the private artifact folder or the private repository.
5. Open a PR, pass applicable checks and merge. Future deployment uses the public
   repository's approved files. A merge alone does not imply deployment exists.

Unapproved candidates stay private. Public CI must not read raw research data,
receive private storage credentials, or print raw prompts in logs. Link only
approved derivatives from public HTML; do not embed private paths or URLs.
These controls are requirements to implement, not claims of automated enforcement.

## Backups and recovery

Create a consistent SQLite snapshot together with the referenced artifact versions
and an integrity manifest. Encrypt external-drive backups and test a restore into
a separate private location, checking database integrity and linked-file hashes.
If off-site backup is later selected, encrypt before upload and retain control of
the key. The diagram's optional cloud path is not authorization to upload data.

Choose retention, deletion, backup schedule, recovery objectives and key recovery
before live collection. Repository history cannot restore research files that
were deliberately kept outside Git.

SBW-8 owns backup planning and setup before live collection: select the physical
device type and capacity using measured storage needs, define encryption and
recovery-key storage, frequency and retention, disconnection and separate storage,
and test restoring a consistent SQLite snapshot with its linked artifact files.
The architecture establishes the backup boundary; hardware and operating details
remain undecided until that task is completed.

## Jira's role

Jira tracks implementation work for this project. Research records have their own
permanent identifiers and do not depend on Jira. When useful, a record may include
an optional link to a related Jira task. No Jira task is required per prompt or
design activity. Store project tracking summaries in Jira; keep full prompts and
raw evidence in private local storage.

## Delivery and acceptance

| Ticket | Architecture dependency |
| --- | --- |
| SBW-7 | Approved event/case contract defines records across live and historical paths |
| SBW-4 and SBW-5 | Establish historical access and supported live capture |
| SBW-6 | Prove exact capture and report limitations |
| SBW-8 | Set up private storage, durable logging, categorization, encrypted backups and tested recovery |
| SBW-9 | Implement version-linked artifact capture and screenshots |
| SBW-10 | Validate reproducible mining transformations and exports |
| SBW-11 | Build the journal and discovery pilot; review resulting insights |

SBW-12 acceptance: the diagram and explanations cover live/historical sources,
both repositories, local database and artifacts, labeled processing flows,
explicit publication approval, independent Jira tracking, backups, and component
status. Shari approved publication of this architecture. Diagram rendering and
repository checks must pass before merge; implementing these components is
separate work.

## Related decisions

- [Process Mining Data Contract](Process%20Mining%20Data%20Contract.md)
- [Private Data Storage](Private%20Data%20Storage.md)
- [Data Security Policy](Data%20Security%20Policy.md)
- [Git Pipeline](Git%20Pipeline.md)
- [Product Goals and Planning](Product%20Goals%20and%20Planning.md)
- [Work Log](Work%20Log.md)
