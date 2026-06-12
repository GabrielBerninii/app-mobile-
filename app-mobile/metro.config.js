const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const isProduction = process.env.EXPO_PUBLIC_ENV === "production";

if (isProduction) {
  config.transformer = {
    ...config.transformer,
    minifierConfig: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_funcs: ["console.log", "console.warn", "console.error", "console.info"],
      },
      mangle: { toplevel: false },
      output: { comments: false },
    },
  };
}

module.exports = config;
