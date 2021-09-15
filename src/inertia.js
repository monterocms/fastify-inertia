const kLazy = Symbol("InertiaLazy");
const globallyShared = {};

class Inertia {
  static lazy(value) {
    return {
      [kLazy]: true,
      value,
    };
  }

  static share(key, value) {
    globallyShared[key] = value;
  }

  constructor({ request, reply, options, version }) {
    this.request = request;
    this.reply = reply;
    this.options = options;
    this.version = version;
    this.sharedProps = {};
    this.viewProps = {};
  }

  share(key, value) {
    this.sharedProps[key] = value;
  }

  flushShared() {
    this.sharedProps = {};
  }

  async render(component, data = {}) {
    this._applyHeaders();

    const props = await this._resolveProps(data);
    const page = {
      component,
      props,
      url: this.request.url,
      version: this.version,
    };

    if (this.request.headers["X-Inertia"]) {
      return this.reply
        .headers({ "X-Inertia-Version": this.version })
        .send(page);
    }

    const result = await this.options.renderRootView({
      ...this.viewProps,
      page: JSON.stringify(page)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;"),
    });

    if (typeof result === "string") {
      this.reply.type("text/html");
    }

    return this.reply
      .headers({ "X-Inertia-Version": this.version })
      .send(result);
  }

  location(url) {
    return this.reply
      .status(409)
      .headers({
        "X-Inertia-Location": url ?? this.request.url,
      })
      .send("");
  }

  redirect(url) {
    this._applyHeaders();

    return this.reply.redirect(url ?? this.request.headers.url);
  }

  _applyHeaders() {
    this.reply.headers({
      Vary: "Accept",
      "X-Inertia": true,
    });
  }

  async _resolveProps(renderProps) {
    const resolvedProps = {};
    const allProps = {
      ...globallyShared,
      ...this.options.share(),
      ...this.sharedProps,
      ...renderProps,
    };

    const propKeys = this.request.headers["x-inertia-partial-data"]
      ? this.request.headers["x-inertia-partial-data"].split(",")
      : Object.keys(allProps);

    // @TODO: walk down nested objects and arrays to omit lazy keys
    propKeys.forEach(async (propKey) => {
      // Check if the prop needs to be resolved (partial reloads)
      if (typeof allProps[propKey] === "function") {
        resolvedProps[propKey] = await allProps[propKey]();
      }

      // Check if the prop is lazy (partial reloads)
      if (allProps[propKey] && allProps[propKey][kLazy]) {
        resolvedProps[propKey] = allProps[propKey].value;
      }

      resolvedProps[propKey] = allProps[propKey];
    });

    return resolvedProps;
  }
}

module.exports = Inertia;
