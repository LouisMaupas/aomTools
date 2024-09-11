module.exports = {
  locales: ["en", "fr"],
  output: "src/locales/$LOCALE/$NAMESPACE.json",
  defaultNamespace: "translation",
  keySeparator: false,
  namespaceSeparator: false,
  createOldCatalogs: false,
  keepRemoved: false,
  sort: false,
};
