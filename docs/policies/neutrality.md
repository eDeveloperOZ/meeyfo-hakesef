# Neutrality policy

- Use the same source classes, component skeleton, sort order, dialogs, and external-link
  behavior for every party.
- Sort financing records by amount descending only.
- Do not provide party-specific popups, warnings, interstitials, or navigation friction.
- Avoid accusatory or motive-implying language.
- Do not connect a counterparty's business interests to party policy without an explicit,
  relevant official statement; in v1 such causal claims are out of scope.
- Use constrained business-role templates: founder, office held, or reported material holding,
  each with a source and verification date.
- Show missing data as “לא דווח” or the documented no-record state, never as a fabricated zero.
- Keep guarantees and liabilities visually distinct from cash received. By owner decision,
  active guarantees are included in the site's “reported income” total while remaining
  separately subtotaled and explicitly labeled as contingent.
- The Economic Party is a disclosed inclusion exception only; every other rule is identical.

`scripts/neutrality-lint.ts` contains an extensible forbidden lexicon and runs in CI.
