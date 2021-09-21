const Inertia = require("./inertia");
const defaults = require("./defaults");

function plugin(fastify, options, next) {
  options = { ...defaults, ...options };

  fastify.addHook("onRequest", async function (request, reply) {
    const version = await options.resolveAssetVersion(request);
    const inertia = new Inertia({ request, reply, options, version });

    if (
      request.method === "GET" &&
      request.headers["x-inertia"] &&
      request.headers["x-inertia-version"] !== version
    ) {
      return inertia.location(request.url);
    }

    request.inertia = inertia;
    reply.inertia = inertia;
  });

  fastify.addHook("onSend", async (request, reply) => {
    if (
      request.headers["x-inertia"] &&
      ["PUT", "PATCH", "DELETE"].includes(request.method)
    ) {
      reply.code(303);
    }
  });

  next();
}

module.exports = plugin;
