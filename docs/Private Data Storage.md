# Private Data Storage

Planning recommendation recorded October 30, 2026. No database, backup service,
or storage integration has been installed as part of this recommendation.

## Recommendation

Keep the database entirely on your computer, outside GitHub. Start locally: the
expected personal workflow workload is unlikely to require a hosted database
initially. Validate that assumption during the pilot.

Storage location controls access; it does not by itself establish legal ownership.
Saving a local copy does not remove copies already held by the chat service.

## Recommended setup

| Component | Location |
| --- | --- |
| Prompts, timestamps, categories, event relationships | Local SQLite database |
| Screenshots, documents, generated images | Local private folder, linked from the database |
| Backups | Encrypted external drive; optional encrypted cloud backup |
| Public HTML page and approved insights | Public GitHub repository |

SQLite is designed for application-local storage and requires no database server
or subscription. It suits a personal workflow journal well.
[SQLite documentation](https://www.sqlite.org/whentouse.html)

Keep this storage outside the current OneDrive workspace and outside any Git
repository. Otherwise, files intended to stay local could be synchronized to your
Microsoft account. Choose a dedicated local folder and confirm its permissions
and exclusion from synchronization before collecting data.

Use device encryption and tested encrypted backups. A local database alone is
not a backup. Back up the database consistently together with its linked artifacts
and verify that both can be restored.

## Expected data volume

Screenshots will probably consume much more space than text. For illustration,
not as a forecast:

- 100,000 events averaging 10 KB each: approximately 1 GB, before indexes and backups.
- 10,000 screenshots averaging 2 MB each: approximately 20 GB.

That is a reasonable local workload, subject to available disk space. Measure
actual growth during the pilot, generate small thumbnails, and avoid storing
duplicate images. Continuous video recording would change storage requirements
substantially.

## Low-cost hosted alternatives

The following prices were discussed on October 30, 2026. They are reference
figures, not a price guarantee; check the linked provider terms before purchase.

| Option | Pricing at planning time | When it makes sense |
| --- | --- | --- |
| Supabase managed PostgreSQL | Free includes 500 MB database and 1 GB file storage; Pro starts at $25/month. Free projects may pause after inactivity. | Remote access or several devices |
| Backblaze B2 | Storage advertised at $6.95/TB/month, with transfer allowances and other applicable costs. | Optional encrypted off-site backups; file storage, not a database |

- [Supabase pricing](https://supabase.com/pricing)
- [Supabase Free-plan details](https://supabase.com/kb/faqs/platform/free-postgres-for-side-projects)
- [Backblaze pricing](https://www.backblaze.com/sign-up/cloud-storage)

A hosted database needs authenticated access, restrictive permissions, and
private file storage. Hosted does not mean public, but it introduces another
provider holding the data. If cloud backups are selected, encrypt them before
upload and keep the decryption key under your control.

## Publication boundary

Only reviewed exports enter the public publishing workflow. Keep raw data,
database files, backups, and unreviewed screenshots out of GitHub, public build
inputs, CI logs, and deployment artifacts. Public insights and screenshots need
review for confidential or identifying information before release. Every public
release requires Shari's explicit approval.

Local SQLite, separate artifact files, device encryption, and tested encrypted
backups are the starting recommendation. Move to hosted PostgreSQL later if
remote access becomes useful; data volume alone is unlikely to justify it at
the start.

## Decisions still needed

- Local storage location and access permissions.
- Backup destination, schedule, encryption/key handling, and restore procedure.
- Retention rules and available-disk-space thresholds.
- Whether any off-site provider is needed after the pilot.

SQLite is the planned authoritative event store. Generate any JSONL exports from
it rather than maintaining a second independent log. Define export consistency
and provenance when implementing the data contract.
