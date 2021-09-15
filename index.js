const fp = require("fastify-plugin");
const plugin = require("./src/plugin");
const Inertia = require("./src/inertia");

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
fastifyInertia.Inertia = Inertia;
fastifyInertia.fastifyInertia = fastifyInertia;
fastifyInertia.default = fastifyInertia;

module.exports = fastifyInertia;
