# Privacy and data handling

## Public dataset

For a natural person, store only:

- stable project ID;
- full name as published in the statutory record;
- locality only when officially published and needed for disambiguation.

Never store street address, national ID, phone, email, family details, wealth estimates, or
unrelated personal information.

For organizations, a statutory registrar number is allowed because it identifies the legal
entity rather than a private person.

## Owner information

Private owner data belongs under `private/` or `.env*`. Do not commit it, put it in client
code, write it into Git history, or expose it in generated downloads.

## Visitor privacy

The site is static. Countdown dismissal uses localStorage for a device preference. Analytics
is disabled unless the owner separately approves production activation. If enabled, only the
documented aggregate events are permitted, with no user-level identifiers or political
profiling.
