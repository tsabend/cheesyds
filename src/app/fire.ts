import * as Firebase from 'firebase';
require('dotenv').config()
const config = {
  apiKey: process.env.FB_API_KEY,
  authDomain: "cheesyd-c02a3.firebaseapp.com",
  databaseURL: "https://cheesyd-c02a3.firebaseio.com",
  projectId: "cheesyd-c02a3",
  storageBucket: "cheesyd-c02a3.appspot.com",
  messagingSenderId: process.env.FB_MESSAGE_SENDER_ID,
  appId: process.env.FB_APP_ID,
  measurementId: process.env.FB_MEASUREMENT_ID
};

export type FBApp = Firebase.app.App;
export const fire: FBApp = Firebase.initializeApp(config);
