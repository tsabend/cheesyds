import * as Firebase from "firebase";
import * as functions from "firebase-functions";
require("dotenv").config();

const appKey = process.env.FB_API_KEY || functions.config().fb?.api_key;
const senderId = process.env.FB_MESSAGE_SENDER_ID || functions.config().fb?.message_sender_id;
const appId = process.env.FB_APP_ID || functions.config().fb?.app_id;
const measurementId = process.env.FB_MEASUREMENT_ID || functions.config().fb?.measurement_id;

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

export type FBApp = Firebase.app.App;
export const fire: FBApp = Firebase.initializeApp(config);
