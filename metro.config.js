const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimierungen für kleinere Bundle-Größe
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    compress: {
      // Entferne console.log in Production
      drop_console: true,
    },
    mangle: {
      keep_fnames: true,
    },
    output: {
      comments: false,
    },
  },
};

// Asset-Optimierungen
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts.filter((ext) => ext !== 'svg')],
};

module.exports = config;
