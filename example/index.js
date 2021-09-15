const fastify = require("fastify");
const static = require('fastify-static')
const inertia = require("../index");
const readFile = require('fs').promises.readFile
const md5 = require('md5')

const app = fastify();

app.register(static, { root: __dirname + "/public" })

app.register(inertia, {
  async resolveAssetVersion () {
    const manifest = await readFile(__dirname + '/public/mix-manifest.json', {
      encoding: 'utf8'
    })
    return md5(manifest)
  },
  share() {
    return {
      foo: 'bar'
    }
  },
  async renderRootView(context) {
    const manifest = await readFile(__dirname + '/public/mix-manifest.json', {
      encoding: 'utf8'
    })
    const files = JSON.parse(manifest)
    return `
      <html>
        <head>
          <title></title>
          <script defer src="${files['/js/main.js']}"></script>
        </head>
        <body>
          <div id="app" data-page='${context.page}'></div>
        </body>
      </html>
    `
  }
});

app.get("/", function (request, reply) {
  return reply.inertia.render("Home", { msg: "This is the home page" });
});

app.get("/about", function (request, reply) {
  return reply.inertia.render("About", { msg: "This is the about page" });
});

console.log('Server running at http://localhost:3000')
app.listen(3000);
