let mix = require("laravel-mix");

mix.setPublicPath("public");

mix.js("src/main.jsx", "js/main.js");
mix.react();
mix.version();
