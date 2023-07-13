export default {
  expo: {
    name: "Phonetica",
    slug: "Phonetica",
    version: "1.0.10",
    orientation: "portrait",
    icon: "./app/assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./app/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FFBF23",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,

      supportsTablet: false,
      bundleIdentifier: "com.Zaman.Phonetica",
      buildNumber: "14",
      appStoreUrl:
        "https://apps.apple.com/us/app/phonetica-learn-to-read/id6450615825",
    },
    android: {
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,

      adaptiveIcon: {
        foregroundImage: "./app/assets/adaptive-icon.png",
        backgroundColor: "#FFBF23",
      },
      package: "com.Zaman.Phonetica",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "@react-native-firebase/app",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      [
        "expo-tracking-transparency",
        {
          userTrackingPermission:
            "This identifier will be used to deliver personalized ads to you.",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission:
            "Your camera will be used to scan and then translate text.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Your image library will be used so you can select an image to scan",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "3ce28d51-eedb-4909-ae7c-970bdcb7aacf",
      },
    },
    updates: {
      url: "https://u.expo.dev/3ce28d51-eedb-4909-ae7c-970bdcb7aacf",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
  },
};
