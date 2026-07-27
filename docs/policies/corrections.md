# Corrections policy

1. Accept reports through the structured GitHub issue form.
2. Ask for an official source URL and no sensitive personal data.
3. Reproduce the issue against the canonical CSV and source.
4. If confirmed, update the canonical record and add a row to `data/corrections.csv`.
5. Use `superseded_by` rather than silently rewriting historical records when the official
   publication itself supersedes a record.
6. Bump `data/dataset-release.json`.
7. Include the generated refresh report in the pull request.
8. Never merge or deploy without owner review.

A temporary broken link does not justify deleting the record.
