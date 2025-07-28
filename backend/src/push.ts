// Example: Push notification setup using Firebase Cloud Messaging (FCM)
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = JSON.parse(process.env.FCM_SERVICE_ACCOUNT || '{}');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export async function sendPushNotification(token: string, title: string, body: string) {
  await admin.messaging().send({
    token,
    notification: { title, body },
  });
}
