const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Exclude optional platform-specific binaries that don't exist on this machine
config.watchFolders = config.watchFolders || [];
config.resolver = config.resolver || {};
config.resolver.blockList = [
  // Exclude Linux/ARM optional lightningcss binaries (not on Windows)
  /node_modules[/\\].*lightningcss-linux.*/,
  /node_modules[/\\].*lightningcss-darwin.*/,
  /node_modules[/\\].*lightningcss-freebsd.*/,
  // Exclude temp metro-babel-transformer directories
  /node_modules[/\\]@react-native[/\\]\.metro-babel-transformer-.*/,
];

module.exports = withNativeWind(config, { input: "./app/global.css" });

