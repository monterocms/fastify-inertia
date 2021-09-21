let mix = require("laravel-mix");

mix.setPublicPath("public");

mix.ts("src/main.tsx", "js/main.js");
mix.react();
mix.version();
