import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.experimentalgarden.chat",
  appName: "Experimental Garden",
  webDir: "www",
  server: {
    // Production: set to your deployed server URL
    // url: "https://your-server.example.com",
    // Development: uncomment below for local testing
    // url: "http://localhost:3000",
    androidScheme: "https",
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "Experimental Garden",
  },
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0f1117",
    },
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#0f1117",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
