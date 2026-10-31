# Data Security Policy

Status: proposed policy for review. These requirements describe the intended
setup; they do not confirm that storage or publication controls are implemented.

## Private storage and repository separation

The local database and artifact folder will be outside the current OneDrive
workspace. Raw research data will stay outside both repositories. The private
research repository will have a separate folder and Git history from this one.

## Public release controls

Every public release requires Shari's explicit approval. Only explicitly selected
files will be copied into the public project. Review will include screenshots,
identifying details, confidential information, and any embedded data. Private
records must also stay out of public CI logs, build inputs, and deployment
artifacts. Public presentation code must not require access to the private database.

## Scope of protection

Storage and access controls support privacy; they do not by themselves establish
legal ownership or remove copies already held by other services.
