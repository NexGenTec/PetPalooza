import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexgentech.petpaloozaa',
  appName: 'PetPalooza',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_launcher_round.png",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;