const Inertia = require("./inertia");
const defaults = require("./defaults");

function plugin(fastify, options, next) {
  options = { ...defaults, ...options };

  fastify.addHook("onRequest", async function (request, reply) {
    const version = await options.resolveAssetVersion(request);
    const inertia = new Inertia({ request, reply, options, version });

    if (
      request.method === "GET" &&
      request.headers["X-Inertia"] &&
      request.headers["X-Inertia-Version"] !== version
    ) {
      return inertia.location(request.url);
    }

    request.inertia = inertia;
    reply.inertia = inertia;
  });

  next();
}

module.exports = plugin;
