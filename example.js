const fastify = require("fastify");
const inertia = require("./index");

const app = fastify();

app.register(inertia);

app.get("/", function (request, reply) {
  return reply.inertia("home", { msg: "Hello world" });
});

app.listen(3000);
