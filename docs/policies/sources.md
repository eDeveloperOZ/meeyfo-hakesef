# Source policy

## Financing evidence

Use only statutory Israeli public sources: State Comptroller, Knesset, Central Elections
Committee, ministries, Registrar of Political Parties / Corporations Authority, Israel
Securities Authority, official TASE filings, and other statutory public bodies.

The allowlist enforced by `validate-data` is:

`mevaker.gov.il`, `knesset.gov.il`, `bechirot.gov.il`, `*.gov.il`, `isa.gov.il`,
`maya.tase.co.il`, and `tase.co.il`.

Party websites, news media, blogs, social media, Wikipedia, commercial databases, and
unattributed summaries are forbidden for financing records.

## Business-profile assertions

Preference order:

1. ISA filings
2. TASE filings
3. Corporations Authority
4. Official investor-relations pages
5. Official corporate sites
6. Official institutional biographies

Wikipedia and personal sites may appear only as clearly marked external reading.

## Metadata tier

Recognized polls and institutional research may support party eligibility or axis placement.
They must never be used as financing evidence.

The poll base is deliberately multi-outlet and follows `party-inclusion.md`. Institutional
party profiles and published research may support the editorial axis only when the exact
locator and the non-scientific nature of the placement are recorded.

## Retention

Never delete a legitimate record because a URL is temporarily unavailable. Set the source
state honestly and record the link-check result. Automated-access blocks and odd HTTP statuses
must be reported as `blocked_bot` or `unexpected_status`, then checked manually.
