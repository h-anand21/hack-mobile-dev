import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const EXPO_PUSH_API = 'https://exp.host/--/api/v2/push/send';
const EXPO_ACCESS_TOKEN = process.env.EXPO_PUSH_ACCESS_TOKEN;

interface PushNotificationPayload {
  to: string | string[]; // Expo push token(s)
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
}

export const sendPushNotification = async (payload: PushNotificationPayload) => {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    };

    if (EXPO_ACCESS_TOKEN) {
      headers['Authorization'] = `Bearer ${EXPO_ACCESS_TOKEN}`;
    }

    const response = await axios.post(
      EXPO_PUSH_API,
      {
        ...payload,
        sound: payload.sound || 'default'
      },
      { headers }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error sending push notification:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};
