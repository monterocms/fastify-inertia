const fp = require("fastify-plugin");

const defaultOptions = {
  resolveAssetVersion: (request) => {
    return "1";
  },
  share()
};

class Inertia {
    sharedProps = {}
    pageProps = {}

    share(key, value) {
        this.sharedProps[key] = value
        return this
    }

    render(component, props = {}) {
        
    }
    
    redirect() {
        
    }
}

function plugin(fastify, options, next) {
  options = { ...defaultOptions, ...options };

  fastify.addHook('onRequest', async function (request) {
    request.inertia = new Inertia(options)
  });

  fastify.decorateReply("inertia", async function (component, props) {
    const page = {
      version: await options.resolveAssetVersion(this.request),
    };  

    return { page };
  });

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
