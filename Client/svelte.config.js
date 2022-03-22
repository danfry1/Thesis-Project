const sveltePreprocess = require("svelte-preprocess");
const production = !process.env.ROLLUP_WATCH;

module.exports = {
  preprocess: sveltePreprocess({
    sourceMap: !production
  })
};