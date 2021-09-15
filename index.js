const fp = require("fastify-plugin");
const Inertia = require('./src/inertia')

const defaultOptions = {
  resolveAssetVersion: (request) => {
    return "1";
  },
  share() {
    return {
      //
    }
  },
  renderRootView(context) {
    throw new Error('Inertia Error: You must implement a root view handler')
  }
};


function plugin(fastify, options, next) {
  options = { ...defaultOptions, ...options };

  fastify.addHook('onRequest', async function (request, reply) {
    const inertia = new Inertia({request, reply, options})
    
    request.inertia = inertia
    reply.inertia = inertia
  });

  // fastify.decorateReply("inertia", function () {
  //   console.log(this.request)
  //   return this.request.inertia
  // });

  next();
}

const fastifyInertia = fp(plugin, {
  fastify: ">=3",
  name: "fastify-inertia",
});

/**
 * These export configurations enable JS and TS developers
 * to consume fastify-inertia in whatever way best suits their needs.
 * Some examples of supported import syntax includes:
 * - `const fastifyInertia = require('fastify-inertia')`
 * - `const { fastifyInertia } = require('fastify-inertia')`
 * - `import * as fastifyInertia from 'fastify-inertia'`
 * - `import { fastifyInertia } from 'fastify-inertia'`
 * - `import fastifyInertia from 'fastify-inertia'`
 */
fastifyInertia.fastifyInertia = fastifyInertia;
fastifyInertia.default = fastifyInertia;
module.exports = fastifyInertia;
