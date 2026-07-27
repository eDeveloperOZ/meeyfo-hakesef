# Data refresh runbook

Use this runbook when the owner says “עדכן את הנתונים”.

1. Read `AGENTS.md`, all source/privacy/neutrality policies, the canonical CSV files, and
   `data/dataset-release.json`.
2. Enumerate every current-cycle official source already in `data/sources.csv`, then identify
   official new surfaces from the same statutory authorities.
3. Check for new or changed records. Respect robots.txt, terms, rate limits, and download
   features. If automated access is not allowed, stop that access and ask the owner for a
   manual retrieval.
4. Update canonical CSVs only. Preserve stable IDs and use `superseded_by` for official
   replacements.
5. Run `npm run validate-data`. Fix every failure.
6. Run `npm run check:links`, then `npm run refresh:report`. Inspect both the JSON and Hebrew
   reports for:
   - new records;
   - modified records;
   - removed or superseded records;
   - changed amounts;
   - changed source URLs;
   - broken links;
   - ambiguous records requiring owner review;
   - records rejected as unofficial and the reasons;
   - exact timestamp.
7. Resolve every ambiguous factual claim or leave it unpublished. Bump
   `data/dataset-release.json` only after the canonical data are final for this refresh.
8. Create branch `data-refresh/YYYY-MM-DD`.
9. Run `npm run validate`, then gitleaks. Commit the canonical data, release metadata,
   corrections, and both refresh reports.
10. Open a pull request. Include provenance, counts, changed amounts and URLs, broken links,
    rejected sources, ambiguity status, and the generated reports.
11. Never merge or deploy. The owner reviews and merges; Vercel deploys from `main`.

No unreviewed ambiguous factual claim may be published.
