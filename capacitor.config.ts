
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.87e551044d3c4c1bb582a795a39ce54b',
  appName: 'locasphere-explorer',
  webDir: 'dist',
  server: {
    url: 'https://87e55104-4d3c-4c1b-b582-a795a39ce54b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: true,
      spinnerColor: "#2563eb"
    }
  }
};

export default config;
