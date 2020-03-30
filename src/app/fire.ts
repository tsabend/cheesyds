import * as FirebaseApp from 'firebase/app';
import 'firebase/database';
require("dotenv").config();

const appKey = process.env.FB_API_KEY;
const senderId = process.env.FB_MESSAGE_SENDER_ID;
const appId = process.env.FB_APP_ID;
const measurementId = process.env.FB_MEASUREMENT_ID;

const config = {
  apiKey: appKey,
  authDomain: "cheesyd-c02a3.firebaseapp.com",
  databaseURL: "https://cheesyd-c02a3.firebaseio.com",
  projectId: "cheesyd-c02a3",
  storageBucket: "cheesyd-c02a3.appspot.com",
  messagingSenderId: senderId,
  appId,
  measurementId,
};

export type FBApp = FirebaseApp.app.App;
export const fire: FBApp = FirebaseApp.initializeApp(config);
