# Contributing

Use Node 22.13+ and install with `npm ci`. Make focused changes, then run `npm run format`, `npm run check`, and `npm run build`.

Describe the user-visible behavior and validation in each pull request. For UI changes, include desktop and mobile screenshots and verify keyboard navigation. For logger or data changes, verify that incomplete/warm-up sets do not contribute, secondary muscles receive half credit, active sessions survive reload, and routine edits do not modify historical records.

Avoid committing browser backups, credentials, installed dependencies, or generated builds. Keep sample data labeled and removable. Changes to stored data structures should preserve existing records or provide a tested migration path.
