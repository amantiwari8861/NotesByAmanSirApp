const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.resolverMainFields = ['main', 'module', 'browser', 'react-native'];

module.exports = withNativeWind(config, { input: "./global.css" });
