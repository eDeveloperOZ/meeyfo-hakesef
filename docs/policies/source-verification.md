# Source verification

The four layers are separate:

1. **URL availability** — status, redirects, and content type.
2. **Document retrieval** — bytes received, PDF/HTML detection, and optional SHA-256.
3. **Structural extraction** — expected fields and record boundaries.
4. **Semantic verification** — a human checks that the source supports the exact published
   claim.

`check-links` performs layers 1 and 2 only. Data collectors perform layer 3. A financing
record may be published only after layer 4 is recorded as `verified`.

If robots.txt or terms do not allow automated retrieval, stop automated access and ask the
owner to retrieve the document manually. Record that provenance without claiming automated
verification.

Known restriction recorded on 2026-07-27: the State Comptroller website terms require access
through the interfaces and instructions supplied by the site. `check-links` therefore makes no
automated document request to `mevaker.gov.il` hosts. Those sources are checked through the
public user interface and reported as `manual_check_required`. The site's `robots.txt` returned
HTTP 200 with no rules, but an empty robots file does not override the terms.

Known restriction recorded on 2026-07-27: `mayafiles.tase.co.il/robots.txt` returned HTTP 403
to the automated checker. The two cited filings were opened and semantically checked through a
regular browser. `check-links` therefore reports that host as `manual_check_required` instead
of retrying or bypassing the restriction.

States:

- `verified`
- `pending_semantic`
- `unreachable_temp`
- `superseded`
