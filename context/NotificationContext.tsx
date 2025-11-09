import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAuth } from './AuthContext';
import api from './api';
import { handleApiError } from './apiErrorHandler'; 
import axios from 'axios'; 

interface NotificationContextType {
  expoPushToken: string | null;
  sendNotification: (title: string, body: string, data?: any) => Promise<void>;
  scheduleLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
  registerForPushNotificationsAsync: () => Promise<string | null>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const { user, token } = useAuth(); 

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (user && token && expoPushToken) {
      sendTokenToBackend(expoPushToken);
    }
  }, [user, token, expoPushToken]);

  const registerForPushNotificationsAsync = async (): Promise<string | null> => {
    let token: string | null = null;

    if (Constants.appOwnership === 'expo') {
      console.warn('As notificações push não são suportadas no Expo Go. Pule o registro.');
      return null;
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
      }

      try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
      } catch (error) {
        console.error('Error getting push token:', error);
        return null;
      }
    } else {
      console.warn('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  };

  const sendTokenToBackend = async (pushToken: string) => {
    try {
      if (token) {
        await api.post('/notifications/register-token', {
          token: pushToken,
          platform: Platform.OS,
        });
      }
    } catch (rawError) {
      const error = await handleApiError(rawError);
      if (axios.isAxiosError(rawError) && rawError.response?.status === 403) {
        console.warn('Authentication failed for push token registration. Logging out...');
      }
      console.error('Error sending push token to backend:', error.message);
    
    }
  };

  const sendNotification = async (title: string, body: string, data?: any) => {
    if (!expoPushToken) {
      console.warn('No push token available');
      return;
    }

    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
    };

    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const scheduleLocalNotification = async (title: string, body: string, data?: any) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, 
        trigger: null,
      });
    } catch (error) {
      console.error('Error scheduling local notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      expoPushToken,
      sendNotification,
      scheduleLocalNotification,
      registerForPushNotificationsAsync,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
