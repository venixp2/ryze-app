export default {
  async scheduled(_e, env, ctx) {
    ctx.waitUntil(fetch("https://YOUR-PROJECT.pages.dev/api/cron", { method: "POST", headers: { "x-cron-key": env.CRON_KEY } }));
  },
};
