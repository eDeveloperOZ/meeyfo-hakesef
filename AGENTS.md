# Agent constitution for מאיפה הכסף

## Purpose

This repository powers a Hebrew-only, RTL, static civic-information website about
reported Israeli party financing for the 26th Knesset election cycle. It aggregates
already-public information. It does not accuse, infer motives, recommend a vote, or rank
parties morally.

Read this file before changing code, content, data, workflows, or deployment settings.
For a data update, follow `docs/runbooks/data-refresh.md` exactly.

## Non-negotiable neutrality

1. Apply identical source rules, thresholds, components, navigation, and external-link
   behavior to every party.
2. Every official party-site link must use `ExternalPartyLink`.
3. Never infer causation between a donor, guarantor, lender, business role, and party policy.
4. Distinguish money received, credit, guarantees, public financing, and liabilities.
5. A guarantee is not cash received, but by owner decision it is included in the site's
   “reported income” headline. Always show the guarantee subtotal separately and label it as
   contingent so the convention cannot be mistaken for a cash total.
6. The Economic Party is a disclosed owner exception to inclusion, not to source quality.
7. Run `npm run lint:neutrality` for every editorial or data-note change.

See `docs/policies/neutrality.md`.

## Source policy

Financing records may cite only the State Comptroller, Knesset, Central Elections
Committee, government ministries, Registrar of Political Parties / Corporations Authority,
Israel Securities Authority, official stock-exchange filings, or another Israeli statutory
public body.

Allowed financing domains:

- `mevaker.gov.il`
- `knesset.gov.il`
- `bechirot.gov.il`
- `*.gov.il`
- `isa.gov.il`
- `maya.tase.co.il`
- `tase.co.il`

Party sites, media, social media, Wikipedia, blogs, commercial databases, and unattributed
summaries are forbidden as financing evidence. Polls and institutional research may support
eligibility or axis placement only. External “learn more” links are never evidence.

An HTTP success proves availability, not semantic support. See
`docs/policies/sources.md` and `docs/policies/source-verification.md`.

## Privacy

Public person data is limited to name and, only when officially published and necessary for
disambiguation, locality. Never store or publish street address, national ID, phone, email,
family details, or unrelated personal data. Private owner information belongs only in
`private/` or `.env*`, both ignored by Git.

Run gitleaks before every commit and in CI. See
`docs/policies/privacy-data-handling.md`.

## Stop conditions (verbatim)

Work autonomously and persistently. Stop and ask the owner ONLY when an action falls under:

1. Login or authorization involving an external account (GitHub remote creation counts — see §5; Vercel always counts).
2. Creating a paid resource or accepting a paid plan.
3. First production publication.
4. Publishing a factual record without an approved official source.
5. An action that may violate terms of service, robots.txt, copyright, rate limits, or automated-access restrictions.
6. Making the repository public.
7. Sending an email or any external message.
8. Exposing any of the owner's personal information.
9. Enabling analytics or cookies in production.
10. A legal ambiguity that materially affects publication.

Additional owner-approval moments defined by the architecture: applying licenses (explain
implications first), approving the owner's "about" bio text, approving party-logo usage after
the legal checklist exists, and confirming repository name/visibility. Do NOT stop for
ordinary implementation choices — they are all decided in this prompt. Do not finish after
producing mockups or a partial scaffold; placeholders are acceptable only for records that
cannot legally or technically be collected, and they must be visibly marked in the UI and
dataset.

## Commands

Use Node 22 and npm.

- `npm run validate` — full local release validation
- `npm run build:data` — canonical CSV to typed JSON and public downloads
- `npm run validate-data` — schema and cross-entity checks
- `npm run check:links` — robots-aware availability and retrieval checks
- `npm run lint:neutrality` — forbidden language and neutrality checks
- `npm test` — unit, schema, and neutrality tests
- `npm run test:e2e` — Playwright E2E and accessibility projects
- `npm run refresh:report` — machine-readable and Hebrew refresh reports
- `npm run build` — static Next.js export to `out/`

Never weaken a test to make a failure disappear.

## Runbook and policy index

- `docs/runbooks/data-refresh.md`
- `docs/policies/sources.md`
- `docs/policies/neutrality.md`
- `docs/policies/corrections.md`
- `docs/policies/party-inclusion.md`
- `docs/policies/source-verification.md`
- `docs/policies/privacy-data-handling.md`
- `docs/legal/legal-review-checklist.md`
- `docs/deployment.md`
- `docs/data-dictionary.md`
