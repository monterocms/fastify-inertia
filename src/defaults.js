module.exports = {
  resolveAssetVersion: (request) => {
    return "1";
  },

  share() {
    return {};
  },

  renderRootView(context, request) {
    throw new Error("Inertia Error: You must implement a root view handler.");
  },
};
