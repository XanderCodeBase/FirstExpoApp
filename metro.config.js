const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add SQL support for Drizzle migrations
config.resolver.sourceExts.push('sql');

// Apply NativeWind
module.exports = withNativewind(config, { inlineRem: 16 });
