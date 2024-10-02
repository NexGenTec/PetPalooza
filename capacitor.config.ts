import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexgentech.petpaloozaa',
  appName: 'PetPalooza',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    GoogleMaps: {
      apiKey: 'AIzaSyCqA3bYv-K0j6KPVberqM2i88bT0zd7XZU',
    },
  },
};

export default config;