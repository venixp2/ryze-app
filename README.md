# Cortex / RYZE team tracker (source)

One Cloudflare Pages worker (`src/index.js`) plus one single-page app (`src/page.html`). Data lives in one Cloudflare KV namespace. No framework, no build step beyond `deploy.sh`.

The same code runs two looks, chosen by the web address: an address ending `cortex-hq.pages.dev` gets the red/black "Cortex" look, anything else gets the blue "RYZE" look. Name, logo, colors, products, pay, positions, teams, emojis, conversation types and tier bonuses are all editable inside the app (owner Settings tab), so most changes need no code.

## What is in the box
- Production, Metrics (weekly funnel charts), Team (MVP, Critical Condition / Upper Echelon, bar graph), Orders, Your Standard, Matchups, Retention, Interviews (resumes, questionnaires, 115/110 results), Convos, Attendance, Car rides, Networking, Territories, People, Settings.
- Push alerts, 8:30 PM reminder and interview reminders (needs the cron worker).
- Tier bonuses (weekly units) and Sunday-aware streaks.

## Setup on your own Cloudflare account (about 20 minutes)
1. Install Node and run `npm i -g wrangler`, then `wrangler login`.
2. Create storage: `wrangler kv namespace create APP_DATA`. Copy the id into `pages/wrangler.jsonc`.
3. Create the site: `wrangler pages project create YOUR-PROJECT-NAME --production-branch main`. Put the same name in `deploy.sh` and `pages/wrangler.jsonc`.
4. Push keys: run `node gen-vapid.mjs`. Paste the printed public key into `src/index.js` (the PUBLIC_VAPID line) and `src/page.html` (applicationServerKey). Then `cd pages && wrangler pages secret put VAPID_JWK --project-name YOUR-PROJECT-NAME < ../vapid-private.jwk`. In `src/index.js` change the two `sub:` web addresses to your own.
5. Create the first owner login: put this in a file `users.json` (pick your own 6-digit code) and run `wrangler kv key put users --namespace-id YOUR_ID --remote --path users.json`:
   `[{"name":"Your Name","team":"Admin","role":"owner","jd":true,"title":"CEO","code":"123456"}]`
   After that, add everyone else inside the app (People tab, Add a person). It gives each person their own code.
6. Reminders (optional): choose a secret, `wrangler pages secret put CRON_KEY --project-name YOUR-PROJECT-NAME`, edit `cron/worker.js` with your address, then `cd cron && wrangler deploy && wrangler secret put CRON_KEY`.
7. Deploy: `./deploy.sh`.

## Rules to keep
- Never commit `users.json`, `vapid-private.jwk`, or any code list. Anyone with a login code can act as that person.
- Back up before big changes: `wrangler kv key get users ...` and copy `src/`.
- Test a change on a preview first: `cd pages && wrangler pages deploy dist --project-name YOUR-PROJECT-NAME --branch preview`.
