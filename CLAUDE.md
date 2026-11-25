# Notes for Claude working on this repo

- `src/index.js` is the Cloudflare Pages worker. `src/page.html` is the whole UI (one HTML file with inline script). `deploy.sh` inlines the HTML into the worker and runs `wrangler pages deploy`.
- Data is one KV namespace bound as `XE_DATA`. Keys: `users`, `config`, `products`, `prices`, `positions`, `terr`, `notesx`, `qidx`, plus per-record keys `m:<date>:<name>` (metrics), `o:<date>:<id>` (orders), `i:<id>` (interviews), `fb:<id>:<name>` (115/110 results), `std:<weekMonday>:<name>` (Your Standard), `eod:<date>`, `r:` (car rides), `push_subs`. KV list calls lag about 60 seconds after a write, so read a key directly when you need a fresh answer.
- KV metadata is limited to 1 KB. Interview records keep a copy in metadata, so keep new fields short.
- Roles: owner, manager, admin, activations, rep. `jd` marks leaders. `convos` and `seeAll` are per-person switches. The owner can edit most things at runtime in Settings and People, so prefer that over code changes.
- Look and feel are token driven (CSS variables injected by the worker from the `THEMES` table and `config.accent`). Do not hard-code colors.
- Every screen must work on phone, tablet, desktop and TV. Check at 390, 820, 1440 and 1920 wide before shipping.
- Never log or print login codes. Never commit secrets.
- After editing, run `node --check src/index.js` and a syntax check of the inline scripts, test on a preview deployment first, then deploy.
