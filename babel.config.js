module.exports = function (api) {
    api.cache(true);

    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",           // ← Move here (as preset)
        ],
        plugins: [
            // Expo Router (can be explicit, but often not needed)
            // require.resolve('expo-router/babel'), // try without first

            // Reanimated MUST be last
            "react-native-reanimated/plugin",
        ],
    };
};
