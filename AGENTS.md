# SD endurance tool

This is an independent React/Vite Git repository. Run commands here.

- Model authority: `docs/handoff/ACCEPTANCE.md` and Figma model 00. Preserve counting scope, decimal conversions and evidence limits.
- Inputs start empty. Results, charts, sensitivity and calculation steps share one successful unrounded snapshot.
- Run `npm ci`, `npm run lint`, `npm test`, `npm run test:e2e`, and `npm run build` before a release.
- Use the Codex in-app browser for actual visual and interaction review, separately from E2E tests.
- `package.json.version` is the version source. Release with `npm version ... -m "chore(release): v%s"` and `git push origin main --follow-tags`.
- Only semantic version tags deploy this repository's GitHub Pages site. Never commit dist, node_modules, secrets, or local review scratch files.
- Adding this new tool to the toolbox is explicitly authorized for this task; change only its catalog entry and its own release metadata there.
